import React, { useEffect, useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import styles from "./userProfile.module.css";
import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const defaultTheme = createTheme();

const Profile = () => {
  const fileInputRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const [userData, setUserData] = useState({});
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    try {
      fetch("https://us-central1-csci-5410-391423.cloudfunctions.net/userdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
        }),
      }).then(async (response) => {
        const data = await response.json();
        // console.log(data);
        if (response.status === 404) {
          console.log("Ok");
        } else if (response.status === 200) {
          console.log(data);
          setUserData(data);
        }
      });
      // fetch("https://us-central1-serverless-project-392814.cloudfunctions.net/getTeamidName", {
      //   method:"POST",
      //   use
      // }).then().catch();
    } catch (e) {
      console.log(e);
    }
  }, []);
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const imageRef = ref(storage, `profilePictures/${user.username}`);
    uploadBytes(imageRef, imageData).then(() => {
      // console.log("Profile picture uploaded.");
      getDownloadURL(imageRef).then((url) => {
        let userDetails = JSON.parse(localStorage.getItem("user"));
        userDetails.firstName = userData.firstName;
        userDetails.lastName = userData.lastName;
        userDetails.photoUrl = url;
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
            localStorage.setItem("user", JSON.stringify(userDetails));
            setUserData(userDetails);
            // navigate("/");
          }
        });
        console.log(url);
      });
    });
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const handleUploadPhoto = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    console.log(event);
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setImageData(file);
    }
  };
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Paper
            className={styles.profilePaper}
            sx={{ marginTop: 8, my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            elevation={6}>
            <Box
              component="card"
              sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography component="h1" variant="h5">
                User Profile
              </Typography>
              <Box component="form" onSubmit={handleProfileUpdate} sx={{ mt: 5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8} md={8} sm={4}>
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      placeholder="First Name"
                      value={userData.firstname}
                      onChange={handleChange}
                      autoComplete="firstName"
                      defaultValue=""
                      autoFocus
                    />
                    <TextField
                      required
                      fullWidth
                      margin="normal"
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      placeholder="Last Name"
                      value={userData.lastName}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      id="outlined-disabled"
                      label="Email"
                      defaultValue={user?.email}
                      value={userData?.email}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <img
                      className={styles.userImage}
                      style={{ borderRadius: "50%" }}
                      width="60%"
                      src={userData.photoUrl ? userData.photoUrl : "/user.jpg"}
                      onClick={handleUploadPhoto}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  onClick={handleProfileUpdate}
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Update
                </Button>
              </Box>
            </Box>
          </Paper>
          <Accordion className={styles.profileStatistics}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>Statistics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {/* {
                  teams
                } */}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Container>
      </ThemeProvider>
    </>
  );
};
export default Profile;
