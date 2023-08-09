import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { blue, green, orange, purple, red, teal, pink, indigo, cyan } from "@mui/material/colors";
import CustomAvatar from "../CustomAvatar";

const UsersList = ({ team }) => {
  const chooseRandomColor = () => {
    const colors = [
      blue[500],
      green[500],
      orange[500],
      purple[500],
      red[500],
      teal[500],
      pink[500],
      indigo[500],
      cyan[500],
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
        Your Team
      </Typography>
      <Grid container spacing={2}>
        {team?.users?.map((user) => {
          const randomColor = chooseRandomColor();
          return (
            <Grid item key={user.userId} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ backgroundColor: randomColor }}>
                <CardContent
                  sx={{
                    pb: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <CustomAvatar
                    name={user.firstName}
                    sx={{ width: "100%", margin: "0 auto" }}
                    color={randomColor}></CustomAvatar>
                  <CardContent>
                    <Typography color={"#f5f5f5"} variant="h6">
                      {user.firstName}
                    </Typography>
                  </CardContent>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default UsersList;
