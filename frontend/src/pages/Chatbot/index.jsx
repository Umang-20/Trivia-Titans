import React, { useState, useRef, useEffect } from "react";
import { Button, TextField, Typography, Card } from "@mui/material";
import { LexRuntimeV2 } from "@aws-sdk/client-lex-runtime-v2";

import styles from "./index.module.css";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [credentials, setCredentials] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    sessionToken: "",
  });
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const chatboxRef = useRef(null);

  useEffect(() => {
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    getCredentials();
  }, []);

  console.log(credentials);

  const getCredentials = async () => {
    try {
      const { data } = await axios.get(
        "https://us-central1-project-csci5410.cloudfunctions.net/awsCred"
      );
      setCredentials({
        accessKeyId: data.keyId,
        secretAccessKey: data.accessKey,
        sessionToken: data.sessionToken,
      });
    } catch (error) {
      console.error("Error getting credentials:", error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: "user" }]);
      setIsLoading(true);
      setInputValue("");
      try {
        const data = await processUserInput(inputValue);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.messages[0].content, sender: "chatbot" },
        ]);
      } catch (error) {
        console.error("Error interacting with Lex V2:", error);
      }
      setIsLoading(false);
    }
  };

  const processUserInput = async (input) => {
    const params = {
      botId: process.env.REACT_APP_LEX_BOT_ID,
      botAliasId: process.env.REACT_APP_LEX_BOT_ALIAS_ID,
      localeId: "en_US",
      sessionId: "unique-session-id",
      text: input,
    };
    try {
      const lexV2 = new LexRuntimeV2({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: credentials,
      });
      const data = await lexV2.recognizeText(params);
      return data;
    } catch (error) {
      console.error("Error interacting with Lex V2:", error);
      throw error;
    }
  };

  return (
    <Card className={styles["chatbot-container"]} elevation={3}>
      <div className={styles["chatbot-heading"]}>
        <Typography variant="h4" align="center" gutterBottom>
          Virtual Assistance
        </Typography>
      </div>
      <div className={styles["chatbot-messages"]} ref={chatboxRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.sender === "user" ? styles.user : styles.chatbot
            }`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className={`${styles.message} ${styles.chatbot}`}>loading...</div>}
      </div>
      <form className={styles["chatbot-form"]} onSubmit={handleFormSubmit}>
        <TextField
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          fullWidth
          placeholder="Type your message..."
        />
        <Button type="submit" variant="contained" color="primary" disabled={!inputValue}>
          Send
        </Button>
      </form>
    </Card>
  );
};

export default Chatbot;
