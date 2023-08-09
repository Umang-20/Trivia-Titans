import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import classes from "./index.module.css";

const AuthHeader = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar className={classes.wrapper}>
        <Typography variant="h6" className={classes.title} onClick={() => navigate("/")}>
          Trivia Titans
        </Typography>
        <div className={classes.buttonWrapper}>
          <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AuthHeader;
