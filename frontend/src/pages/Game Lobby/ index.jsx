import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import UsersList from "../../components/UsersList";
import GameCard from "../../components/GameCard";
import ChatApp from "../../components/TeamChat";
import PlayGame from "../../components/PlayGame";
import axios from "axios";
import { CircularProgress, Button, Typography } from "@mui/material";
import styles from "./gameLobby.module.css";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useDispatch, useSelector } from "react-redux";
import { setGameScore } from "../../store/actions/gameScore";
import ScoreBoard from "../../components/ScoreBoard";

const URL = "wss://ws12ulrovf.execute-api.us-east-1.amazonaws.com/dev";

const GameLobby = () => {
  const { gameId } = useParams();
  const currTeamId = "piyAEjC1rXtrlYrL8aqH";
  // const currUserId = "SsqrV3dlLUAWechMljF0";
  const currUserId = JSON.parse(localStorage.getItem("user")).userId;
  let socket = useRef(null);

  const dispatch = useDispatch();
  const { scores } = useSelector((store) => store.gameScore);
  console.log(scores);

  // const queryParams = new URLSearchParams(window.location.search);
  // const currTeamId = queryParams.get("teamId");
  // const currUserId = queryParams.get("userId");
  // const queryParams = new URLSearchParams(window.location.search);
  // const currTeamId = queryParams.get("teamId");
  // const currUserId = queryParams.get("userId");

  const sampleQuestions = [
    {
      a: "No",
      b: "Yes",
      c: "Maybe",
      question: "Is dog a pet?",
      d: "rubbish",
      correct: "b",
      explanation: "Dog is obviously a pet animal",
      questionId: "5goIXr1x3sSWHIJiwMpK",
    },
    {
      question: "What is you name?",
      a: '"Shivam"',
      b: "Jainil",
      c: "John",
      d: "Melena",
      correct: "a",
      explanation: "It doesn't need any explanation",
      questionId: "Gt0hSXHsHq2Vcpy4zccM",
    },
    {
      a: "45",
      b: "0",
      c: "-45",
      question: "What is 45 - 90?",
      d: "100",
      correct: "c",
      explanation: "45 - 90 = -45",
      questionId: "OyUxf1p0NOhxhgV98OLJ",
    },
  ];

  // const sampleQuestions = [
  //   {
  //     question: "What is 3 + 4 ?",
  //     a: 12,
  //     b: 23,
  //     c: 7,
  //     d: 34,
  //     correct: "c",
  //     explanation: "1 - Explanation text will go here.",
  //   },
  //   {
  //     question: "What is maths ?",
  //     a: "bfhjes",
  //     b: "fieowsnj dk",
  //     c: "hcuiwbfj",
  //     d: "bhjdwsbh",
  //     correct: "a",
  //     explanation: "2 - Explanation text will go here.",
  //   },
  //   {
  //     question: "New Question ?",
  //     a: "bfhjes",
  //     b: "fieowsnj dk",
  //     c: "hcuiwbfj",
  //     d: "bhjdwsbh",
  //     correct: "a",
  //     explanation: "3 - Explanation text will go here.",
  //   },
  //   {
  //     question: "3rd questions? fav. pet? ?",
  //     a: "bfhjes",
  //     b: "fieowsnj dk",
  //     c: "hcuiwbfj",
  //     d: "bhjdwsbh",
  //     correct: "a",
  //     explanation: "4 - Explanation text will go here.",
  //   },
  // ];
  // const sampleQuestions = [
  //   {
  //     question: "What is 3 + 4 ?",
  //     a: 12,
  //     b: 23,
  //     c: 7,
  //     d: 34,
  //     correct: "c",
  //     explanation: "1 - Explanation text will go here.",
  //   },
  //   {
  //     question: "What is maths ?",
  //     a: "bfhjes",
  //     b: "fieowsnj dk",
  //     c: "hcuiwbfj",
  //     d: "bhjdwsbh",
  //     correct: "a",
  //     explanation: "2 - Explanation text will go here.",
  //   },
  //   {
  //     question: "New Question ?",
  //     a: "bfhjes",
  //     b: "fieowsnj dk",
  //     c: "hcuiwbfj",
  //     d: "bhjdwsbh",
  //     correct: "a",
  //     explanation: "3 - Explanation text will go here.",
  //   },
  //   {
  //     question: "3rd questions? fav. pet? ?",
  //     a: "bfhjes",
  //     b: "fieowsnj dk",
  //     c: "hcuiwbfj",
  //     d: "bhjdwsbh",
  //     correct: "a",
  //     explanation: "4 - Explanation text will go here.",
  //   },
  // ];

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleOpenChat = () => {
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  // const handleJoinGame = () => {
  //   console.log("EXECUTED");
  //   socket.current = new WebSocket(URL);
  // const handleJoinGame = () => {
  //   console.log("EXECUTED");
  //   socket.current = new WebSocket(URL);

  //   socket.current = new ReconnectingWebSocket(URL, [], {
  //     connectionTimeout: 5000, // Maximum time to establish the initial connection
  //     maxRetries: 10, // Maximum number of reconnection attempts
  //     minReconnectionDelay: 1000, // Minimum delay between reconnection attempts
  //     maxReconnectionDelay: 30000, // Maximum delay between reconnection attempt
  //   });
  //   socket.current = new ReconnectingWebSocket(URL, [], {
  //     connectionTimeout: 5000, // Maximum time to establish the initial connection
  //     maxRetries: 10, // Maximum number of reconnection attempts
  //     minReconnectionDelay: 1000, // Minimum delay between reconnection attempts
  //     maxReconnectionDelay: 30000, // Maximum delay between reconnection attempt
  //   });

  //   socket.current.addEventListener("open", onSocketOpen);
  //   socket.current.addEventListener("close", onSocketClose);
  //   socket.current.addEventListener("message", (e) => {
  //     onSocketMessage(e.data);
  //   });
  //   socket.current?.addEventListener("error", (error) => {
  //     console.error("WebSocket error:", error);
  //   });
  //   socket.current.addEventListener("open", onSocketOpen);
  //   socket.current.addEventListener("close", onSocketClose);
  //   socket.current.addEventListener("message", (e) => {
  //     onSocketMessage(e.data);
  //   });
  //   socket.current?.addEventListener("error", (error) => {
  //     console.error("WebSocket error:", error);
  //   });

  //   console.log(socket.current);
  // };
  //   console.log(socket.current);
  // };

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://aj8bs2zi4e.execute-api.us-east-1.amazonaws.com/dev/game?id=${gameId}`
        );
        console.log(data);
        const startTime = new Date(data.game.time?._seconds * 1000);
        const minute = startTime.getUTCMinutes() - 1;
        const month = startTime.getUTCMonth() + 1;
        const date = startTime.getUTCDate();
        const hour = startTime.getUTCHours();
        const year = startTime.getUTCFullYear();
        useEffect(() => {
          (async function () {
            try {
              setLoading(true);
              const { data } = await axios.get(
                `https://aj8bs2zi4e.execute-api.us-east-1.amazonaws.com/dev/game?id=${gameId}`
              );
              console.log(data);
              const startTime = new Date(data.game.time?._seconds * 1000);
              const minute = startTime.getUTCMinutes() - 1;
              const month = startTime.getUTCMonth() + 1;
              const date = startTime.getUTCDate();
              const hour = startTime.getUTCHours();
              const year = startTime.getUTCFullYear();

              console.log(`${minute} ${hour} ${date} ${month} ? ${year}`);
              setGame({
                ...data.game,
                startTime: `${minute} ${hour} ${date} ${month} ? ${year}`,
              });
              setLoading(false);
              // handleJoinGame();
            } catch (err) {
              setLoading(false);
              console.log(err);
            }
          })();
        }, []);
        console.log(`${minute} ${hour} ${date} ${month} ? ${year}`);
        setGame({
          ...data.game,
          startTime: `${minute} ${hour} ${date} ${month} ? ${year}`,
        });
        setLoading(false);
        // handleJoinGame();
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    })();
  }, []);

  const onSocketOpen = useCallback(() => {
    // const startTime = new Date(game.time?._seconds * 1000);
    // const minute = startTime.getUTCMinutes() - 1;
    // const month = startTime.getUTCMonth() + 1;
    // const date = startTime.getUTCDate();
    // const hour = startTime.getUTCHours();
    // const year = startTime.getUTCFullYear();
    const onSocketOpen = useCallback(() => {
      // const startTime = new Date(game.time?._seconds * 1000);
      // const minute = startTime.getUTCMinutes() - 1;
      // const month = startTime.getUTCMonth() + 1;
      // const date = startTime.getUTCDate();
      // const hour = startTime.getUTCHours();
      // const year = startTime.getUTCFullYear();

      // console.log(`${minute} ${hour} ${date} ${month} ? ${year}`);
      // console.log(`${minute} ${hour} ${date} ${month} ? ${year}`);

      console.log(game.startTime);
      console.log(game.startTime);

      socket.current?.send(
        JSON.stringify({
          action: "$default",
          gameId: gameId,
          userId: currUserId,
          startTime: game.startTime,
        })
      );
    });
    socket.current?.send(
      JSON.stringify({
        action: "$default",
        gameId: gameId,
        userId: currUserId,
        startTime: game.startTime,
      })
    );
  });

  const onSocketClose = useCallback(() => {
    console.log();
  });
  const onSocketMessage = useCallback((data) => {
    console.log(data);
    const message = JSON.parse(data);
    console.log(message);
    if (message.questions) {
      console.log(questions);
      setQuestions(message.questions);
    }
    if (message.scores) {
      console.log(message.scores);
      dispatch(setGameScore(message.scores));
    }
  });

  const submitAnswer = (data) => {
    socket.current?.send(
      JSON.stringify({
        action: "SubmitAnswer",
        gameId: gameId,
        userId: currUserId,
        questionId: data.questionId,
        at: data.at,
        userAnswer: data.userAnswer,
        timeTaken: data.timeTaken,
      })
    );
  };

  useEffect(() => {
    const handleJoinGame = () => {
      console.log("EXECUTED");
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
    handleJoinGame();
  }, [game]);

  const myTeam = game?.teams?.find((team) => team.teamId === currTeamId);

  return (
    <div style={{ textAlign: "left", position: "relative", height: "100vh" }}>
      {/* <div
  return (
    <div style={{ textAlign: "left", position: "relative", height: "100vh" }}>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingInline: "40px",
          paddingBlock: "12px",
          borderBottom: "1px solid #e3e3e3",
          position: "sticky",
          top: 0,
          right: 0,
          left: 0,
          backgroundColor: "white",
        }}>
        <Typography variant="h6">{game.gameName}</Typography>
        <Button variant="text" onClick={handleOpenChat}>
          Open Chat
        </Button>
        <div>
          {chatOpen ? (
            <div className={styles.chatWindow}>
              <ChatApp team={myTeam} userId={currUserId} closeChat={handleCloseChat} />
            </div>
          ) : null}
        </div>
      </div> */}
      {!loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 450px",
            gridTemplateRows: "1fr",
            height: "100%",
          }}>
          <div
            style={{
              padding: "8px 16px",
            }}>
            {questions?.length !== 0 ? (
              <>
                <PlayGame questions={questions} submitAnswer={submitAnswer} />
                <ScoreBoard scores={scores} />
              </>
            ) : (
              <div
                style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  padding: "16px",
                }}>
                <div style={{ marginBottom: "20px", width: "375px" }}>
                  <GameCard game={game} actionButtons={false} onSocketMessage={onSocketMessage} />
                </div>
                <UsersList team={myTeam} />
              </div>
            )}
          </div>
          <div
            style={{
              // padding: "8px",
              height: "700px",
            }}>
            <ChatApp team={myTeam} userId={currUserId} closeChat={handleCloseChat} />
          </div>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default GameLobby;
