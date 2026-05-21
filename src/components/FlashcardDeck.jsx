import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { shuffleArray } from "../lib/utils";

const ratingLabels = [
  { id: "hard", label: "😕 Hard", color: "hard" },
  { id: "okay", label: "😐 Okay", color: "okay" },
  { id: "got_it", label: "😊 Got it!", color: "gotit" },
];

export default function FlashcardDeck({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState({});
  const [filterMode, setFilterMode] = useState("all");
  const [order, setOrder] = useState(() => flashcards.map((_, index) => index));

  const visibleCards = useMemo(() => {
    return filterMode === "hard"
      ? flashcards.filter((card) => ratings[card.id] === "hard")
      : flashcards;
  }, [flashcards, filterMode, ratings]);

  useEffect(() => {
    setOrder(visibleCards.map((_, index) => index));
    setCurrentIndex(0);
    setFlipped(false);
  }, [visibleCards.length, filterMode]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight") {
        if (currentIndex < visibleCards.length - 1) {
          setCurrentIndex((value) => value + 1);
          setFlipped(false);
        }
      }
      if (event.key === "ArrowLeft") {
        if (currentIndex > 0) {
          setCurrentIndex((value) => value - 1);
          setFlipped(false);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, visibleCards.length]);

  const currentCard = visibleCards[order[currentIndex]];
  const reviewedCount = visibleCards.filter((card) => ratings[card.id]).length;
  const completed = visibleCards.length > 0 && reviewedCount === visibleCards.length;

  const handleRating = (score) => {
    if (!currentCard) return;
    setRatings((prev) => ({ ...prev, [currentCard.id]: score }));
  };

  const handleShuffle = () => {
    setOrder((current) => shuffleArray(current));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const handleRestart = () => {
    setRatings({});
    setFilterMode("all");
    setOrder(flashcards.map((_, index) => index));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const gotCount = Object.values(ratings).filter((value) => value === "got_it").length;
  const okayCount = Object.values(ratings).filter((value) => value === "okay").length;
  const hardCount = Object.values(ratings).filter((value) => value === "hard").length;

  if (!visibleCards.length) {
    return (
      <section className="flashcard-empty page-card">
        <h2>No cards available</h2>
        <p className="muted">Rate some cards as hard to review them here, or restart the deck.</p>
        <button type="button" className="primary" onClick={handleRestart}>
          Restart Deck
        </button>
      </section>
    );
  }

  return (
    <section className="flashcard-page page-card">
      <div className="flashcard-header-row">
        <div>
          <p className="small-text">Card {currentIndex + 1} of {visibleCards.length}</p>
          <div className="progress-dots">
            {visibleCards.map((card, index) => (
              <span key={card.id} className={`progress-dot ${index <= currentIndex ? "filled" : ""}`} />
            ))}
          </div>
        </div>
        <button type="button" className="secondary" onClick={handleShuffle}>
          <Shuffle size={16} /> Shuffle
        </button>
      </div>

      <div className="flashcard-frame" onClick={() => setFlipped((value) => !value)}>
        <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-label">TERM</span>
            <h2>{currentCard.term}</h2>
            <p className="flashcard-hint">{currentCard.hint}</p>
            <span className="flashcard-flip-help">Click to reveal →</span>
          </div>
          <div className="flashcard-face flashcard-back">
            <span className="flashcard-label back-label">DEFINITION</span>
            <p>{currentCard.definition}</p>
            <p className="flashcard-example">{currentCard.example}</p>
          </div>
        </div>
      </div>

      <div className="flashcard-nav-row">
        <button type="button" className="secondary" onClick={() => { if (currentIndex > 0) { setCurrentIndex((value) => value - 1); setFlipped(false); } }} disabled={currentIndex === 0}>
          <ChevronLeft size={16} /> Prev
        </button>
        <button type="button" className="secondary" onClick={() => { if (currentIndex < visibleCards.length - 1) { setCurrentIndex((value) => value + 1); setFlipped(false); } }} disabled={currentIndex === visibleCards.length - 1}>
          Next <ChevronRight size={16} />
        </button>
      </div>

      {flipped && (
        <div className="rating-row">
          <p>How well did you know this?</p>
          <div className="rating-buttons">
            {ratingLabels.map((rating) => (
              <button key={rating.id} type="button" className={`rating-pill ${rating.color}`} onClick={() => handleRating(rating.id)}>
                {rating.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {completed && (
        <div className="deck-summary page-card">
          <h3>Deck complete</h3>
          <div className="deck-summary-row">
            <span>{gotCount} Got it</span>
            <span>{okayCount} Okay</span>
            <span>{hardCount} Hard</span>
          </div>
          <div className="deck-actions">
            {hardCount > 0 && (
              <button type="button" className="secondary" onClick={() => setFilterMode("hard")}>Review Hard Cards</button>
            )}
            <button type="button" className="primary" onClick={handleRestart}>Restart Deck</button>
          </div>
        </div>
      )}
    </section>
  );
}
