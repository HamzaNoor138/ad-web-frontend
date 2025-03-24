import { useState, useEffect } from "react";
import quizData from "../data/data.json";

const useQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(30);
  const [autoSelected, setAutoSelected] = useState(false);

  useEffect(() => {
    if (showResult) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentQuestion, showResult]);

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(quizData[currentQuestion].correctAnswer.id);
      setAutoSelected(true);
      setTimeout(handleNext, 1000);
    }
  };

  const handleAnswerClick = (optionId) => {
    if (autoSelected) return;
    setSelectedAnswer(optionId);
  };

  const handleNext = () => {
    if (selectedAnswer === null && !autoSelected) {
      alert("Select an answer before proceeding!");
      return;
    }

    if (selectedAnswer === quizData[currentQuestion].correctAnswer.id) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAutoSelected(false);
        setTimer(30);
      } else {
        setShowResult(true);
      }
    }, 300);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimer(30);
    setAutoSelected(false);
  };

  return {
    currentQuestion,
    selectedAnswer,
    score,
    showResult,
    quizData,
    timer,
    handleAnswerClick,
    handleNext,
    handleRestart,
  };
};

export default useQuiz;