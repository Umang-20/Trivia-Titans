import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ScoreBoard from "../ScoreBoard";
import { useDispatch, useSelector } from "react-redux";

const TIME_PER_QUESTION = 20; // in seconds
const EXPLANATION_TIME = 10; // in seconds

const PlayGame = ({ questions, submitAnswer }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalQuestion, setFinalQuestion] = useState(false);

  useEffect(() => {
    const handleAnswerSubmit = () => {
      // Check if the selected option is correct and handle accordingly
      // const currentQuestion = questions[currentQuestionIndex];
      // console.log(selectedOption);
      // if (selectedOption === currentQuestion.correct) {
      //   console.log("Correct Answer!");
      // } else {
      //   console.log("Wrong Answer!");
      // }
      // console.log(
      //   questions[finalQuestion ? questions.length - 1 : currentQuestionIndex - 1].questionId
      // );

      const data = {
        questionId: questions[currentQuestionIndex].questionId,
        at: new Date(),
        userAnswer: selectedOption,
        timeTaken: TIME_PER_QUESTION - timeLeft,
      };

      submitAnswer(data);
    };

    if (selectedOption) {
      handleAnswerSubmit();
    }
  }, [selectedOption]);

  useEffect(() => {
    // Start the timer when the component mounts
    const id = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (isPaused) {
          // If the game is paused, do nothing and return the current time left
          return prevTimeLeft;
        }

        if (prevTimeLeft === 0 && currentQuestionIndex < questions.length - 1) {
          // Pause the game and move to the next question after 10 seconds
          setSelectedOption("");
          setIsPaused(true);
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setTimeout(() => {
            setIsPaused(false);
            setTimeLeft(TIME_PER_QUESTION);
          }, EXPLANATION_TIME * 1000); // 10 seconds pause
          return 0;
        } else if (prevTimeLeft === 0 && currentQuestionIndex === questions.length - 1) {
          // Last question, game finished
          setFinalQuestion(true);
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setTimeLeft(TIME_PER_QUESTION);
            setIsGameOver(true);
          }, EXPLANATION_TIME * 1000); // 10 seconds pause before showing "GAME HAS FINISHED"
        }

        return prevTimeLeft - 1;
      });
    }, 1000); // Run the timer every 1 second

    setIntervalId(id);

    return () => clearInterval(id);
  }, [questions.length, currentQuestionIndex, isPaused]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      {!isGameOver && questions[currentQuestionIndex] ? (
        <>
          {!isPaused ? (
            <>
              <Typography variant="h6" align="center">
                Time Left: {timeLeft} seconds
              </Typography>
              <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                  Question {currentQuestionIndex + 1}
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                  {questions[currentQuestionIndex].question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                    <FormControlLabel
                      value="a"
                      control={<Radio />}
                      label={questions[currentQuestionIndex].a}
                      disabled={timeLeft === 0 || selectedOption !== ""}
                    />
                    <FormControlLabel
                      value="b"
                      control={<Radio />}
                      label={questions[currentQuestionIndex].b}
                      disabled={timeLeft === 0 || selectedOption !== ""}
                    />
                    <FormControlLabel
                      value="c"
                      control={<Radio />}
                      label={questions[currentQuestionIndex].c}
                      disabled={timeLeft === 0 || selectedOption !== ""}
                    />
                    <FormControlLabel
                      value="d"
                      control={<Radio />}
                      label={questions[currentQuestionIndex].d}
                      disabled={timeLeft === 0 || selectedOption !== ""}
                    />
                  </RadioGroup>
                </FormControl>
              </Container>
            </>
          ) : (
            <>
              <h1>
                {
                  questions[finalQuestion ? questions.length - 1 : currentQuestionIndex - 1]
                    ?.explanation
                }
              </h1>
            </>
          )}
        </>
      ) : (
        <div>GAME HAS FINISHED</div>
      )}
    </div>
  );
};

export default PlayGame;
