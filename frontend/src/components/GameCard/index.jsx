import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import ReconnectingWebSocket from "reconnecting-websocket";

const URL = "wss://y47zhd8zv8.execute-api.us-east-1.amazonaws.com/dev";

const GameCard = ({ game = {}, actionButtons = true }) => {
  const navigate = useNavigate();

  const currTeamId = "piyAEjC1rXtrlYrL8aqH";
  const currUserId = JSON.parse(localStorage.getItem("user")).userId;
  console.log(JSON.parse(localStorage.getItem("user")).userId);

  const isTeamInGame = game?.teams?.some((team) => team.teamId === currTeamId);
  const startDate = new Date(game?.time?._seconds * 1000).toLocaleString();

  let socket = useRef(null);

  const handleLobby = () => {
    navigate(`/game/${game?.id}`);
  };

  const onSocketOpen = useCallback(() => {
    socket.current?.send(
      JSON.stringify({
        action: "$default",
        gameId: game.id,
        userId: currUserId,
        startTime: "29 12 27 7 ? 2023",
      })
    );
  });

  const onSocketClose = useCallback(() => {
    console.log("");
  });
  const onSocketMessage = useCallback((data) => {
    console.log(data);
  });

  const handleJoinGame = () => {
    socket.current = new WebSocket(URL);

    socket.current = new ReconnectingWebSocket(URL, [], {
      connectionTimeout: 5000, // Maximum time to establish the initial connection
      maxRetries: 10, // Maximum number of reconnection attempts
      minReconnectionDelay: 1000, // Minimum delay between reconnection attempts
      maxReconnectionDelay: 30000, // Maximum delay between reconnection attempt
    });

    socket.current.addEventListener("open", onSocketOpen);
    socket.current.addEventListener("close", onSocketClose);
    socket.current.addEventListener("message", (e) => {
      onSocketMessage(e.data);
    });
    socket.current?.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    console.log(socket.current);
  };

  return game ? (
    <Card key={game?.id}>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ fontSize: 22, textTransform: "capitalize", fontWeight: 450 }}
        >
          {game?.gameName}
        </Typography>
        <Typography variant="body1">{game?.gameDescription}</Typography>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">Category:</Typography>
              <Typography variant="body2">Timeframe:</Typography>
              <Typography variant="body2">Difficulty:</Typography>
              <Typography variant="body2">Start At:</Typography>
            </Grid>
            <Grid item xs={6} md={8}>
              <Typography variant="body2">
                {game?.category?.charAt(0).toUpperCase() +
                  game?.category?.slice(1)}
              </Typography>
              <Typography variant="body2">{game?.timeframe} minutes</Typography>
              <Typography variant="body2">{game?.difficulty}</Typography>
              <Typography variant="body2">{startDate}</Typography>
            </Grid>
          </Grid>
        </CardContent>

        <Typography
          variant="subtitle1"
          sx={{
            marginBottom: "3px",
            textTransform: "uppercase",
            fontSize: "14px",
            fontWeight: 450,
            color: "#434343",
            letterSpacing: "1px",
          }}
        >
          Teams Joined:
        </Typography>
        <div style={{ display: "flex", gap: "8px" }}>
          {game?.teams?.length !== 0 ? (
            game?.teams?.map((team) => (
              <div key={team.teamId}>
                <Chip label={team.name}></Chip>
              </div>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#434343" }}>
              No Teams Joined
            </Typography>
          )}
          {}
        </div>

        {actionButtons ? (
          <div
            style={{
              marginTop: "16px",
            }}
          >
            {isTeamInGame ? (
              <Button
                variant="contained"
                color="success"
                sx={{ width: "100%" }}
                onClick={handleLobby}
              >
                Go to Lobby
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "https://aj8bs2zi4e.execute-api.us-east-1.amazonaws.com/dev/join-game",
                      {
                        gameId: game.id,
                        teamId: currTeamId,
                      }
                    );
                    alert("You have successfully joined the team!!");
                    // handleLobby();
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                Join Game
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  ) : null;
};

export default GameCard;
