import React from "react";
import { Box, Typography } from "@mui/material";

const ChatBubble = ({ senderName, message, dateTime, isCurrentUser }) => {
  if (typeof message.at === "object") {
    message.at = new Date(message.at._seconds * 1000).toLocaleString();
  }
  return (
    <div
      style={{
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          maxWidth: "60%",
          minWidth: "30%",
          alignSelf: isCurrentUser ? "flex-end" : "stretch",
          padding: "10px",
          marginBottom: "5px",
          backgroundColor: isCurrentUser ? "#1976d2" : "#f1f0f0",
          color: isCurrentUser ? "#fff" : "#000",
          borderRadius: "10px",
        }}
      >
        {!isCurrentUser && <Typography fontWeight="bold">{message.sender}</Typography>}
        <Typography>{message.message}</Typography>
        <Typography fontSize="0.8rem" sx={{ alignSelf: "flex-end", textAlign: "right" }}>
          {message.at}
        </Typography>
      </Box>
    </div>
  );
};

export default ChatBubble;
