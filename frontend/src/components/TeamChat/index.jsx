import React, { useState, useEffect, useCallback, useRef } from "react";
import ChatBubble from "../ChatBubble";
import { Button, Typography } from "@mui/material";

const URL = "wss://1ii3zwcn0k.execute-api.us-east-1.amazonaws.com/dev";

const ChatApp = ({ team, userId, closeChat }) => {
  // const userId = "SsqrV3dlLUAWechMljF0";
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const socket = useRef(null);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    socket.current?.send(
      JSON.stringify({
        action: "$default",
        userId,
        teamId: team?.teamId,
      })
    );
  });

  const onSocketClose = useCallback(() => {
    setIsConnected(false);
  });
  const onSocketMessage = useCallback((data) => {
    setMessages((prevState) => [...prevState, JSON.parse(data)]);
  });

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (e) => {
        onSocketMessage(e.data);
      });
    }
  }, []);

  useEffect(() => {
    onConnect();
    setMessages(team?.chats);

    return () => {
      socket.current?.close();
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.current?.send(
        JSON.stringify({
          action: "sendMessageToTeam",
          message: inputValue,
          userId,
          teamId: team.teamId,
        })
      );

      setInputValue("");
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "min-content 1fr min-content",
      }}
    >
      <div
        style={{
          // position: "sticky",
          // top: "0",
          // left: 0,
          // right: 0,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 12px",
          borderBottom: "1px solid #e3e3e3",
        }}
      >
        {/* {isConnected ? <div>CONNECTED</div> : <div>DISCONNECTED</div>} */}
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: "18px" }}>
          Team Chat
        </Typography>
        <Button onClick={closeChat} color="error" variant="text">
          Close
        </Button>
      </div>
      <div
        style={{
          padding: "16px",
          overflow: "scroll",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((message) => (
          <div key={message.at._seconds ? message.at._seconds : message.at}>
            <ChatBubble
              message={message}
              isCurrentUser={message.sender === userId}
            />
            {/* <strong>{message.sender}:</strong> {message.message} */}
          </div>
        ))}
      </div>
      <div
        style={{
          // position: "sticky",
          // bottom: "0",
          // right: 0,
          // left: 0,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <form
          style={{
            display: "flex",
            boxShadow: "0 -4px 16px -4px rgba(55, 84, 170, 0.16)",
            padding: "6px",
          }}
        >
          <input
            style={{
              flex: 1,
              padding: "4px 8px",
              fontSize: "16px",
              fontWeight: "450",
              outline: "none",
              border: "none",
              borderTop: "none",
            }}
            type="text"
            placeholder="Type your message ..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            sx={{ borderRadius: "1000px" }}
            color="success"
            variant="contained"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
