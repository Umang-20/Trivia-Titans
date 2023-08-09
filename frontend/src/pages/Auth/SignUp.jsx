import React, { useState } from "react";
import { useNavigate } from "react-router";
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

const defaultTheme = createTheme();

const SignUp = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [dialog, setDialog] = useState(false);
  const [code, setCode] = useState();
  const [snackbar, setSnackbar] = useState({
    open: true,
    type: "success",
    message: "Hola amigos",
  });

  const userPool = new CognitoUserPool({
    UserPoolId: process.env.REACT_APP_POOL_ID,
    ClientId: process.env.REACT_APP_APP_CLIENT_ID,
  });
  const handleSignUp = async (e) => {
    e.preventDefault();

    // console.log(process.env.REACT_APP_POOL_ID, process.env.REACT_APP_APP_CLIENT_ID);

    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: userDetails.email,
      }),
    ];
    userPool.signUp(userDetails.email, userDetails.password, attributeList, null, (err, result) => {
      if (err) {
        setSnackbar({
          open: true,
          type: "error",
          message: err.message,
        });
        console.log("Registration error:", err);
      } else {
        // dispatch(setUser(userDetails));
        setUserDetails({
          ...userDetails,
          username: result.userSub,
        });
        localStorage.setItem("tempUser", JSON.stringify(result));
        setDialog(true);
      }
    });
  };

  const handleGoogleSignup = (event) => {
    console.log(event);

    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })
      .then((user) => {
        localStorage.setItem("tempUser", JSON.stringify(user));
      })
      .catch((error) => {
        localStorage.setItem("error", error);
        console.log(error);
      });
  };

  const handleFacebookSignup = (event) => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Facebook });
    console.log(event);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log(e);
    const userData = {
      Username: userDetails.username,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        setSnackbar({
          open: true,
          message: JSON.stringify(err),
          type: "error",
        });
        return;
      }
      console.log(result);
      setSnackbar({
        open: true,
        message: "User Registered",
        type: "success",
      });
      var { userSub } = JSON.parse(localStorage.getItem("tempUser"));
      const signUpUser = {
        username: userSub,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      };
      fetch("https://us-central1-csci-5410-391423.cloudfunctions.net/setUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpUser),
      }).then((response) => {
        if (response.status === 404) {
          console.log(response);
        } else if (response.status === 201) {
          navigate("/mfa");
          localStorage.setItem("user", JSON.stringify(signUpUser));
        }
      });
    });
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({
      open: false,
      message: null,
      type: null,
    });
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="lg">
          {snackbar.open && (
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}>
              <Alert severity={snackbar.type} sx={{ width: "100%" }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          )}
          <Dialog open={dialog} onClose={handleVerify}>
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the verification code you received in your email.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Code"
                type="email"
                fullWidth
                value={code}
                onChange={handleCodeChange}
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleVerify}>Verify</Button>
            </DialogActions>
          </Dialog>

          <CssBaseline />
          <Paper sx={{ marginTop: 8, my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} elevation={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      value={userDetails.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      value={userDetails.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={userDetails.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={userDetails.password}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  buttonText="Sign Up"
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
                <IconButton aria-label="google" onClick={handleGoogleSignup}>
                  <GoogleIcon color={"action"} />
                </IconButton>
                <IconButton aria-label="facebook" onClick={handleFacebookSignup}>
                  <FacebookIcon color={"primary"} />
                </IconButton>
                {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
              >
                <path
                  fill="#039be5"
                  d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                />
                <path
                  fill="#fff"
                  d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                />
              </svg> */}
              </Box>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default SignUp;
