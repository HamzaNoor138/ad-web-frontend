
"use client";
import { useState } from "react";
import useQuiz from "../app/hooks/useQuiz";
import styles from "../app/styles/styles";

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const {
    quizData,
    currentQuestion,
    selectedAnswer,
    score,
    showResult,
    timer,
    handleAnswerClick,
    handleNext,
    handleRestart,
  } = useQuiz();

  const startQuiz = () => setQuizStarted(true);

  if (!quizStarted) {
    return (
      <div style={styles.quizContainer}>
        <button style={styles.startButton} onClick={startQuiz}>Start Quiz</button>
      </div>
    );
  }

  if (!quizData?.length) return <div style={styles.loading}>Loading quiz...</div>;

  return (
    <div style={styles.quizContainer}>
      {showResult ? (
        <div style={styles.result}>
          <h2>Quiz Completed!</h2>
          <p>Score: {score} / {quizData.length}</p>
          <button style={styles.restartButton} onClick={() => { setQuizStarted(false); handleRestart(); }}>Restart Quiz</button>
        </div>
      ) : (
        <div style={styles.quizCard}>

          <div style={styles.header}>
            <span>{quizData[currentQuestion].question}</span>
            <span>Score: {score} / {quizData.length}</span>
            <span style={styles.timer}> {timer}s</span>
          </div>

          {quizData[currentQuestion].image && (
            <div style={styles.imageContainer}>
              <img src={quizData[currentQuestion].image} alt="Question" style={styles.image} />
            </div>
          )}

        
          <div style={styles.options}>
            {quizData[currentQuestion].options.map((option) => {
              const isCorrect = option.id === quizData[currentQuestion].correctAnswer.id;
              const isSelected = option.id === selectedAnswer;
              return (
                <button
                  key={option.id}
                  style={{
                    ...styles.option,
                    ...(isSelected ? styles.selected : {}),
                    ...(selectedAnswer !== null && isCorrect ? styles.correct : {}),
                    ...(selectedAnswer !== null && isSelected && !isCorrect ? styles.incorrect : {}),
                  }}
                  onClick={() => handleAnswerClick(option.id)}
                  disabled={selectedAnswer !== null}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
          <button style={styles.nextButton} onClick={() => handleNext()}>
            {currentQuestion < quizData.length - 1 ? "Next →" : "Show Result"}
          </button>
        </div>
      )}
    </div>
  );
}
