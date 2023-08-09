import React, { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  TableCell,
} from "@mui/material";
import axios from "axios";

// import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
// import axios from 'axios';
const teamManagement = () => {
  const [teamname, setTeamName] = useState("");
  const [emails, setEmails] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteEmails, setInviteEmails] = useState("");
  const [invitesSent, setInvitesSent] = useState("");
  const [teamStats, setTeamStats] = useState([]);
  const [teamStatsDialogOpen, setTeamStatsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const requestBody = {
    user_email: emails,
  };

  const generateTeamName = async () => {
    try {
      const response = await axios.post(
        "https://4hshrwyf6f.execute-api.us-east-1.amazonaws.com/dev/teamname",
        requestBody
      );
      setTeamName(response.data.teamname);
      console.log("ded", teamname);
    } catch (error) {
      console.error("Error generating team name:", error);
    }
  };
  console.log("ded", teamname);
  const sendInvites = async () => {
    try {
      const emailsArray = inviteEmails.split(/\s*,\s*/); // Split on commas with optional spaces
      const request = {
        teamname,
        emails: emailsArray,
      };

      await axios.post(
        "https://tdi942oi26.execute-api.us-east-1.amazonaws.com/dev/sendinvitequeue",
        request
      );
      // Show a success message to the user
      setInvitesSent("Invitations sent successfully!");
    } catch (error) {
      console.error("Error sending invites:", error);
    }
  };

  const fetchTeamMembers = async () => {
    const request = {
      teamname: teamname,
      //   "headers": {
      //     "Access-Control-Allow-Origin": "*",
      //     "Access-Control-Allow-Methods": "GET, OPTIONS",
      //     "Access-Control-Allow-Headers": "Content-Type"
      // }
    };
    try {
      const response = await axios.post(
        " https://mh4psp94z9.execute-api.us-east-1.amazonaws.com/dev/teamdetails",
        request
      );
      // setTeamMembers(response);

      console.log(response);
      const teamsData = response.data.body;

      const parsedData = JSON.parse(teamsData);
      const teams = parsedData.teams;
      console.log("teams", teams);
      const { teamMembers } = teams;
      setTeamMembers(teams);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  const handleTeamStats = async (teamname) => {
    const requestBody = {
      user_email: "momo@gmail.com",
    };

    try {
      const response = await axios.post(
        " https://mh4psp94z9.execute-api.us-east-1.amazonaws.com/dev/teamstats",
        requestBody
      );
      console.log(response);
      console.log(requestBody);
      setTeamStatsDialogOpen(true);
      const { teams_stats } = JSON.parse(response.data.body);
      const teamStat = teams_stats;
      // .find((stat) => stat.teamname === teamname);
      console.log("printing", teams_stats);
      if (teamStat) {
        setTeamStats([teamStat]);
        setTeamStatsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching team stats:", error);
    }
  };
  const handleCloseTeamStatsDialog = () => {
    setTeamStatsDialogOpen(false);
  };
  const removeTeamMember = async (emails) => {
    const request = {
      user_email: emails,
      teamname: teamname,
    };
    try {
      await axios.post(
        " https://mh4psp94z9.execute-api.us-east-1.amazonaws.com/dev/removemember",
        request
      );
      // Show a success message to the user
      setSuccessMessage("User is removed");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing team member:", error);
      setErrorMessage("Removal unsucessful");
    }
  };
  const leaveTeamMember = async (email) => {
    const request = {
      user_email: email,
      teamname: teamname,
    };
    try {
      await axios.post(
        "https://mh4psp94z9.execute-api.us-east-1.amazonaws.com/dev/leaveteam",
        request
      );
      // Show a success message to the user
      setSuccessMessage("you left the team");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing team member:", error);
      setErrorMessage("Removal unsucessful");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 30 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Team Management App
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter email"
              variant="outlined"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={generateTeamName}>
              Generate Team Name
            </Button>
          </Grid>
          <Grid item xs={12}>
            {teamname && (
              <Typography variant="h6" align="center" gutterBottom style={{ color: "green" }}>
                Team Name: {teamname}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Rest of your UI using Material-UI components */}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {/* Invite Members */}
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              Invite Members
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Enter email addresses separated by commas"
              variant="outlined"
              value={inviteEmails}
              onChange={(e) => setInviteEmails(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={sendInvites}>
              Send Invites
            </Button>
            {invitesSent && (
              <Typography variant="body1" align="center" style={{ color: "green" }}>
                {invitesSent}
              </Typography>
            )}
          </Grid>

          {/* Team Members */}
          {/* Team Members Table */}
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              Team Members
            </Typography>
            <Button variant="contained" color="primary" onClick={fetchTeamMembers}>
              Get Teams details
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Team Name</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>Members</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((team) => (
                    <TableRow key={team.teamname}>
                      <TableCell>{team.teamname}</TableCell>
                      <TableCell>{team.admin}</TableCell>
                      <TableCell>{team.members.join(", ")}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeTeamMember(team.members[0])}>
                          Remove
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => leaveTeamMember(team.admin)}>
                          Leave
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {successMessage && (
            <Typography variant="body1" align="center" style={{ color: "green" }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body1" align="center" style={{ color: "red" }}>
              {errorMessage}
            </Typography>
          )}
          {/* View Team Statistics */}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleTeamStats}>
              View Team Statistics
            </Button>
            <Dialog
              open={teamStatsDialogOpen}
              onClose={handleCloseTeamStatsDialog}
              fullWidth
              maxWidth="sm">
              <DialogTitle>Team Statistics</DialogTitle>
              <DialogContent>
                {teamStats.map(
                  (teamStat) => (
                    console.log("inside", teamStat[0].teamname), // This will print each teamStat object to the console
                    (
                      <DialogContentText key={teamStat[0].teamname}>
                        <strong>{teamname}</strong>
                        <br />
                        Total Games: {teamStat[0].totalgames}
                        <br />
                        Total Points: {teamStat[0].totalpoints}
                        <br />
                        Wins: {teamStat[0].wins}
                        <br />
                        Lost: {teamStat[0].lost}
                      </DialogContentText>
                    )
                  )
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseTeamStatsDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>

          {/* <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleTeamStats}>
              View Team Statistics
            </Button> */}
          {/* <Dialog
        open={teamStatsDialogOpen}
        onClose={handleCloseTeamStatsDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Team Statistics</DialogTitle>
        <DialogContent>
          {teamStats.map((teamStat) => (
            <DialogContentText key={teamStat.teamname}>
              <strong>{teamStat.teamname}</strong>
              <br />
              Total Games: {teamStat.totalgames}
              <br />
              Total Points: {teamStat.totalpoints}
              <br />
              Wins: {teamStat.wins}
              <br />
              Lost: {teamStat.lost}
            </DialogContentText>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeamStatsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
            Display team statistics */}
        </Grid>
        {/* </Grid> */}
      </Paper>
    </Container>
  );
};

export default teamManagement;
