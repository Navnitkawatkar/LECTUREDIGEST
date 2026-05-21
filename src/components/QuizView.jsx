import { useMemo, useState } from "react";
import { CircleCheck, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { getDifficultyLabel, getPerformanceLabel } from "../lib/utils";

export default function QuizView({ quiz, onReviewFlashcards }) {
  const questions = quiz.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex] || {};
  const selectedAnswer = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => questions.filter((question) => answers[question.id] === question.correct).length,
    [questions, answers]
  );

  const isAnswered = selectedAnswer !== undefined;
  const scoreLabel = `Score: ${correctCount}/${questions.length}`;

  const handleSelect = (optionIndex) => {
    if (showResults || !currentQuestion.id) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const goNext = () => {
    if (!isAnswered) return;
    if (currentIndex === questions.length - 1) {
      setShowResults(true);
      return;
    }
    setCurrentIndex((value) => value + 1);
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((value) => value - 1);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentIndex(0);
  };

  const getOptionClass = (optionIndex) => {
    if (!isAnswered) return "quiz-option";
    if (optionIndex === currentQuestion.correct) return "quiz-option correct";
    if (optionIndex === selectedAnswer && selectedAnswer !== currentQuestion.correct) return "quiz-option wrong";
    return "quiz-option disabled";
  };

  if (!questions.length) {
    return (
      <section className="quiz-empty page-card">
        <h2>No quiz questions available</h2>
        <p className="muted">Your digest did not generate quiz content. Try another lecture or change difficulty.</p>
      </section>
    );
  }

  return (
    <section className="quiz-view page-card">
      {!showResults ? (
        <>
          <div className="quiz-header-row">
            <div>
              <p className="small-text">Question {currentIndex + 1} of {questions.length}</p>
              <h2>{currentQuestion.question}</h2>
            </div>
            <span className="meta-pill">{getDifficultyLabel(currentQuestion.difficulty)}</span>
          </div>

          <ProgressBar value={currentIndex + 1} max={questions.length} label={scoreLabel} />

          <div className="quiz-options">
            {currentQuestion.options?.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                className={getOptionClass(optionIndex)}
                onClick={() => handleSelect(optionIndex)}
                disabled={isAnswered}
              >
                <span>{option}</span>
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className={`quiz-feedback ${answers[currentQuestion.id] === currentQuestion.correct ? "correct" : "wrong"}`}>
              {answers[currentQuestion.id] === currentQuestion.correct ? (
                <>
                  <CircleCheck size={18} /> <strong>Correct!</strong>
                </>
              ) : (
                <>
                  <X size={18} /> <strong>Not quite</strong>
                </>
              )}
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="quiz-control-row">
            <button type="button" className="secondary" onClick={goBack} disabled={currentIndex === 0}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button type="button" className="primary" onClick={goNext} disabled={!isAnswered}>
              {currentIndex === questions.length - 1 ? "See Results" : "Next Question →"}
            </button>
          </div>
        </>
      ) : (
        <div className="quiz-results-card">
          <div className="score-ring">
            <span>{Math.round((correctCount / questions.length) * 100)}%</span>
          </div>
          <h2>{correctCount} out of {questions.length} correct</h2>
          <p className="performance-label">{getPerformanceLabel(correctCount, questions.length)}</p>

          <div className="review-list">
            {questions.map((question) => {
              const correct = answers[question.id] === question.correct;
              return (
                <div key={question.id} className={`review-item ${correct ? "review-correct" : "review-wrong"}`}>
                  <span>{correct ? "✔" : "✕"}</span>
                  <p>{question.question}</p>
                </div>
              );
            })}
          </div>

          <div className="quiz-control-row">
            <button type="button" className="secondary" onClick={resetQuiz}>
              Retake Quiz
            </button>
            <button type="button" className="primary" onClick={onReviewFlashcards}>
              Review Flashcards →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
