import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, Layers, ChevronRight } from "lucide-react";
import { useDigest } from "../hooks/useDigest";
import SessionCard from "../components/SessionCard";
import LoadingDigest from "../components/LoadingDigest";
import { wordCount, getDifficultyLabel } from "../lib/utils";

const sampleLecture = `The cell cycle is the series of events that take place in a cell leading to its division and duplication. It consists of four main phases: G1, S, G2, and M phase. During G1 (Gap 1), the cell grows and prepares for DNA synthesis. The S phase involves DNA replication where each chromosome is duplicated. G2 (Gap 2) involves further growth and preparation for division. The M phase (Mitosis) is where actual cell division occurs.

Mitosis itself has four stages: Prophase, where chromosomes condense and the nuclear envelope breaks down. Metaphase, where chromosomes align at the cell's equator. Anaphase, where sister chromatids are pulled apart to opposite poles. Telophase, where nuclear envelopes reform around each set of chromosomes, followed by Cytokinesis which splits the cytoplasm.

Meiosis differs from mitosis in that it produces four genetically unique haploid cells rather than two identical diploid cells. This is essential for sexual reproduction. Meiosis involves two rounds of division (Meiosis I and II) and introduces genetic variation through crossing over during Prophase I.`;

const difficultyOptions = [
  { id: "simple", label: "Simple" },
  { id: "standard", label: "Standard" },
  { id: "deep", label: "Deep" },
];

export default function Home({ sessionsHook, setCurrentSessionId }) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState("standard");
  const [customInstructions, setCustomInstructions] = useState("");
  const { loading, error, progress, submitDigest, resetError } = useDigest();
  const sessions = sessionsHook.sessions || [];
  const count = wordCount(notes);

  const sessionCountLabel = useMemo(() => {
    if (!sessions.length) return "";
    return `(${sessions.length})`;
  }, [sessions.length]);

  const handleSubmit = async () => {
    if (count < 50) return;
    try {
      const session = await submitDigest({ notes, difficulty, customInstructions });
      setCurrentSessionId?.(session.id);
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadSample = () => {
    resetError();
    setNotes(sampleLecture);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="brand-row">
          <div className="brand-mark">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="brand-label">LectureDigest</p>
            <p className="brand-note">Smart study sessions from your lecture notes</p>
          </div>
        </div>

        <Link to="#past-sessions" className="past-sessions-link">
          Past Sessions {sessionCountLabel}
          <ChevronRight size={16} />
        </Link>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Study smarter with AI</p>
          <h1>Turn lecture notes into study gold</h1>
          <p className="subtitle">Paste your notes. Get a summary, quiz, and flashcards instantly.</p>
          <div className="feature-pill-row">
            <span className="feature-pill">✦ Smart Summary</span>
            <span className="feature-pill">✦ Auto Quiz</span>
            <span className="feature-pill">✦ Flashcard Deck</span>
          </div>
        </div>

        <div className="hero-image-card">
          <div className="hero-icon-box">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="hero-card-title">Launch your next study session</p>
            <p className="hero-card-copy">Paste notes, choose a pace, and LectureDigest will craft review materials instantly.</p>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingDigest progress={progress} />
      ) : (
        <section className="input-card">
          <NoteInput
            notes={notes}
            onNotesChange={(value) => {
              resetError();
              setNotes(value);
            }}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            customInstructions={customInstructions}
            setCustomInstructions={setCustomInstructions}
            onSubmit={handleSubmit}
            loading={loading}
            disabled={count < 50}
            count={count}
            error={error}
            onLoadSample={handleLoadSample}
            difficultyOptions={difficultyOptions}
          />
          <div className="sample-trial-row">
            <button type="button" className="text-link" onClick={handleLoadSample}>
              Try with a sample lecture →
            </button>
          </div>
        </section>
      )}

      {sessions.length > 0 && (
        <section id="past-sessions" className="past-sessions-section">
          <div className="section-heading-row">
            <div>
              <p className="section-label">Your Study Sessions</p>
              <h2>Review previous digests</h2>
            </div>
            <button type="button" className="secondary small" onClick={sessionsHook.clearAll}>
              Clear All
            </button>
          </div>

          <div className="session-grid">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={() => sessionsHook.deleteSession(session.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
