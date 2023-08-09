import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "../../store/actions/auth";
import { Button, Card } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  IconButton,
  Typography,
  Container,
  CssBaseline,
  Box,
  Avatar,
  Grid,
  Link,
  TextField,
} from "@mui/material";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import "./styles.css";

import { Auth, Hub } from "aws-amplify";

const defaultTheme = createTheme();
const SignIn = () => {
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          dispatch(setUser(data));
          break;
        case "signOut":
          dispatch(setUser(null));
          break;
      }
    });
  }, []);

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      Auth.signIn(userDetails.email, userDetails.password).then((user) => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.username,
          })
        );
        console.log(user);
        navigate("/mfa");
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleGoogleSignin = (e) => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })
      .then((user) => {
        navigate("/mfa");
        // localStorage.setItem("user", user);
        console.log("user from signin", user);
      })
      .catch((error) => {
        // localStorage.setItem("error", error);
      });
  };

  const handleFacebookSignin = (e) => {
    // e.preventDefault()
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
    console.log(e);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card className="signInCard">
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" component="h1">
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSignIn} sx={{ mt: 1 }}>
              <TextField
                required
                margin="normal"
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="password"
                value={userDetails.password}
                onChange={handleChange}
              />
              <br />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                // onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item md={6}>
                  <Link href="/forgotPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item md={6}>
                  <Link href="/signup" variant="body2">
                    {"Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              {/* <div id="google"></div> */}
              <IconButton aria-label="google" onClick={handleGoogleSignin}>
                <GoogleIcon color={"action"} />
              </IconButton>
              <IconButton aria-label="facebook" onClick={handleFacebookSignin}>
                <FacebookIcon color={"primary"} />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
