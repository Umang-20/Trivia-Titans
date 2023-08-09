import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { setMfa as setMFA } from "../../store/actions/auth";

const defaultTheme = createTheme();
const MFA = () => {
  const [mfa, setMfa] = useState({
    username: null,
    q1: "What is your favourite sport?",
    a1: null,
    q2: "What is your birth place?",
    a2: null,
    q3: "What is childhood name?",
    a3: null,
  });
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [mfaQuestion, setMfaQuestion] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    type: "",
    message: "",
    open: false,
  });

  useEffect(() => {
    setLoading(true);
    const tempUser = localStorage.getItem("tempUser");
    var body = {};
    const localUser = localStorage.getItem("user");
    if (user || tempUser) {
      if (user) {
        body = { username: user.username };
      } else if (tempUser) {
        body = { username: JSON.parse(tempUser).userSub };
      }

      setMfa((prevState) => ({
        ...prevState,
        username: body.username,
      }));

      try {
        fetch("https://us-central1-csci-5410-391423.cloudfunctions.net/userdetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }).then(async (response) => {
          const data = await response.json();
          console.log(data);
          if (response.status === 404) {
            setRegistered(false);
            setLoading(false);
          } else if (response.status === 200) {
            if (data?.q1) {
              setRegistered(true);
              setCurrentUser(data);
              handleQuestion(data);
            }
            setLoading(false);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [user]);

  const handleQuestion = (currentUser) => {
    if (currentUser !== null) {
      const randomQue = "q" + (Math.floor(Math.random() * 3) + 1).toString();
      localStorage.setItem(
        "mfaQuestion",
        JSON.stringify({
          question: currentUser[randomQue],
          correct: currentUser["a" + randomQue[1]],
        })
      );
      setMfaQuestion((prevState) => ({
        ...prevState,
        question: currentUser[randomQue],
        correct: currentUser["a" + randomQue[1]],
      }));
      setLoading(false);
    }
  };

  const handleSignUpMFA = (e) => {
    e.preventDefault();
    let userDetails = JSON.parse(localStorage.getItem("user"));
    userDetails.q1 = mfa.q1;
    userDetails.a1 = mfa.a1;
    userDetails.q2 = mfa.q2;
    userDetails.a2 = mfa.a2;
    userDetails.q3 = mfa.q3;
    userDetails.a3 = mfa.a3;
    fetch("https://us-central1-csci-5410-391423.cloudfunctions.net/setUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    }).then((response) => {
      if (response.status === 404) {
        console.log(response);
      } else if (response.status === 200 || response.status === 201) {
        // response.json().then((data) => {
        //   console.log(data);
        // });
        localStorage.setItem("user", JSON.stringify(userDetails));
        navigate("/");
      }
    });
  };

  const handleSignInMFA = (e) => {
    e.preventDefault();
    if (mfaQuestion.answer === mfaQuestion.correct) {
      localStorage.setItem("user", JSON.stringify(currentUser));
      dispatch(setMFA(true));
      navigate("/dashboard");
    } else {
      setSnackbar((prevState) => ({
        type: "error",
        message: "Please enter correct answer.",
        open: true,
      }));
    }
    // console.log(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMfa((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setMfaQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      {loading ? (
        <CircularProgress color="success" />
      ) : (
        <>
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
          {registered ? (
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                  sx={{
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <Avatar sx={{ m: 5, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Multi Factor Authentication Single Question
                  </Typography>
                  <Box component="form" onSubmit={handleSignInMFA} noValidate sx={{ mt: 5 }}>
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="q1"
                      name="answer"
                      label={mfaQuestion.question}
                      placeholder="Answer Here"
                      value={mfaQuestion.answer}
                      onChange={handleSignInChange}
                      autoComplete="Question"
                      autoFocus
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          ) : (
            <ThemeProvider theme={defaultTheme}>
              <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                  sx={{
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <Avatar sx={{ m: 5, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Multi Factor Authentication Three Questions
                  </Typography>
                  <Box component="form" onSubmit={handleSignUpMFA} noValidate sx={{ mt: 5 }}>
                    <TextField
                      required
                      margin="normal"
                      fullWidth
                      id="q1"
                      name="a1"
                      label={mfa.q1}
                      placeholder="Answer Here"
                      value={mfa.a1}
                      onChange={handleChange}
                      autoComplete="a1"
                      autoFocus
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="q2"
                      name="a2"
                      label={mfa.q2}
                      placeholder="Answer Here"
                      value={mfa.a2}
                      onChange={handleChange}
                      autoComplete="a2"
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="q3"
                      name="a3"
                      label={mfa.q3}
                      placeholder="Answer Here"
                      value={mfa.a3}
                      onChange={handleChange}
                      autoComplete="a3"
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Container>
            </ThemeProvider>
          )}
        </>
      )}
    </>
  );
};
export default MFA;
