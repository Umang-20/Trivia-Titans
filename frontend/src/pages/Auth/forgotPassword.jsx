import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Auth } from "aws-amplify";
import {
  CssBaseline,
  Container,
  Snackbar,
  Alert,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import { useNavigate } from "react-router";

const defaultTheme = createTheme();

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: true,
    type: "success",
    message: "Hola amigos",
  });

  const handleNext = () => {
    if (activeStep == 0) {
      Auth.forgotPassword(userData.email).then((data) => {
        setSnackbar({
          open: true,
          type: "success",
          message: "Verification code sent.",
        });
      });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    Auth.forgotPasswordSubmit(userData.email, userData.code, userData.password).then((data) => {
      setSnackbar({
        open: true,
        type: "success",
        message: "Password updated.",
      });
      navigate("/signin");
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
          <CssBaseline />
          <Paper sx={{ marginTop: 8, my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} elevation={12}>
            <Typography variant="h5" component="h1">
              Forgot Password
            </Typography>
            <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 3 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>Enter Your Email</StepLabel>
                  <StepContent>
                    <TextField
                      required
                      margin="normal"
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={userData.email}
                      onChange={handleChange}
                      autofocus
                    />
                    <br />
                    <Button onClick={handleNext} variant="contained" color="primary">
                      Next
                    </Button>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Enter Verification Code</StepLabel>
                  <StepContent>
                    <TextField
                      required
                      margin="normal"
                      label="Verification Code"
                      name="code"
                      value={userData.code}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <br />
                    <Button onClick={handleBack}>Back</Button>
                    <Button onClick={handleNext} variant="contained" color="primary">
                      Next
                    </Button>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Set New Password</StepLabel>
                  <StepContent>
                    <TextField
                      required
                      margin="normal"
                      label="New Password"
                      name="password"
                      type="password"
                      value={userData.password}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <br />
                    <TextField
                      required
                      margin="normal"
                      label="Confirm new Password"
                      name="confirmPassword"
                      type="password"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <br />
                    <Button onClick={handleBack}>Back</Button>
                    <Button
                      type="submit"
                      //   onClick={handleForgotPassword}
                      variant="contained"
                      color="primary">
                      Submit
                    </Button>
                  </StepContent>
                </Step>
              </Stepper>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default ForgotPassword;
