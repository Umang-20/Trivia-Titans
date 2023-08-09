import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router";

import "./App.css";
import AuthLayout from "./layout/AuthLayout";
import PrivateLayout from "./layout/PrivateLayout";
import RoutesList from "./routes";
import { Amplify, Auth, Hub } from "aws-amplify";
import { useDispatch } from "react-redux";
import { setUser, setMfa } from "./store/actions/auth";
import jwtDecode from "jwt-decode";

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,

    userPoolId: process.env.REACT_APP_POOL_ID,

    userPoolWebClientId: process.env.REACT_APP_APP_CLIENT_ID,
    oauth: {
      domain: "csci5410-sdp35.auth.us-east-1.amazoncognito.com",
      scope: ["email", "profile", "openid"],
      redirectSignIn: "http://localhost:3000/mfa",
      // redirectSignOut: "http://localhost:3000/",
      // redirectSignIn: "https://sdp35-kmskozun5a-uc.a.run.app/mfa",
      redirectSignOut: "https://sdp35-kmskozun5a-uc.a.run.app/",
      responseType: "token",
    },
  },
});

const App = () => {
  const { user, mfa: MFA } = useSelector((store) => store.auth);
  const [isLogin, setIsLogin] = useState(user?.token || false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          break;
        case "signOut":
          dispatch(setUser(null));
          dispatch(setMfa(false));
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        const userDetails = jwtDecode(currentUser.signInUserSession.idToken.jwtToken);
        const headers = new Headers();
        headers.append(
          "Authorization",
          `Bearer ${currentUser.signInUserSession.accessToken.jwtToken}`
        );
        fetch("https://csci5410-sdp35.auth.us-east-1.amazoncognito.com/oauth2/userInfo", {
          method: "GET",
          headers: headers,
        }).then((response) => {
          if (!response.ok) {
            console.log("Something went wrong!");
            return response.json().then((errorData) => {
              console.log(errorData);
            });
          } else {
            return response.json().then((data) => {
              const localUser = localStorage.getItem("user");
              console.log("localUser: ", localUser);

              console.log("then here");
              localStorage.setItem(
                "user",
                JSON.stringify({
                  username: data.username,
                  email: data.email,
                })
              );
              localStorage.setItem(
                "tempUser",
                JSON.stringify({
                  userSub: data.username,
                })
              );
            });
          }
        });
        dispatch(
          setUser({
            username: currentUser.username,
            email: userDetails.email,
            token: currentUser.signInUserSession.idToken.jwtToken,
          })
        );
      })
      .catch(() => {
        Auth.signOut({ global: true });
        localStorage.clear();
      });

    return unsubscribe;
  }, []);
  const renderRoutes = () => {
    const renderRoute = (Component, layout) => {
      if (Component) {
        switch (layout) {
          case "private":
            return isLogin ? (
              <PrivateLayout>
                <Component />
              </PrivateLayout>
            ) : (
              <Navigate to="/" />
            );
          case "auth":
          default:
            return isLogin && MFA ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthLayout>
                <Component />
              </AuthLayout>
            );
        }
      }
      return null;
    };

    return RoutesList.map((route) => (
      <Route
        key={route.name}
        path={route.path}
        element={renderRoute(route.component, route.layout)}
      />
    ));
  };

  return (
    <div className="App">
      <Routes>
        {renderRoutes()}
        <Route path="*" element={<Navigate to={isLogin ? "/dashboard" : "/"} />} />
      </Routes>
    </div>
  );
};

export default App;
