import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Tabs,
  Tab,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import classes from "./index.module.css";
import { Auth } from "aws-amplify";
import { logOutUser } from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(user?.email || "User");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSignOut = () => {
    Auth.signOut({ global: true });
    dispatch(logOutUser());
    localStorage.clear();
    handleMenuClose();
    navigate("/");
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
      default:
        navigate("/dashboard");
        break;
      case 1:
        navigate("/leaderboard");
        break;
      case 2:
        navigate("/chatbot");
        break;
      case 3:
        navigate('/teamManagement')
    }
  };

  console.log(user, "user");

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar className={classes.wrapper}>
        <Typography variant="h6" className={classes.title} onClick={() => navigate("/dashboard")}>
          Trivia Titans
        </Typography>
        <Tabs value={false} onChange={handleTabChange} centered className={classes.tabs}>
          <Tab label="Home" />
          <Tab label="Leaderboard" />
          <Tab label="Chatbot" />
          <Tab label="Create team"/>
        </Tabs>
        <div>
          <IconButton
            edge="end"
            color="inherit"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}>
            <AccountCircle />
            <Typography variant="body1" className={classes.username}>
              {email}
            </Typography>
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
