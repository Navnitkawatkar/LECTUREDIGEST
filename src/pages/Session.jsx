import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import SummaryView from "../components/SummaryView";
import QuizView from "../components/QuizView";
import FlashcardDeck from "../components/FlashcardDeck";
import ExportButton from "../components/ExportButton";
import SubjectBadge from "../components/SubjectBadge";
import { getDifficultyLabel, formatDate } from "../lib/utils";

const tabs = [
  { id: "summary", label: "📋 Summary" },
  { id: "quiz", label: "❓ Quiz" },
  { id: "flashcards", label: "🃏 Flashcards" },
];

export default function Session({ sessionsHook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  const session = useMemo(() => sessionsHook.getSession(id), [id, sessionsHook]);

  if (!session) {
    return (
      <div className="page-shell">
        <div className="not-found-card page-card">
          <h2>Session not found</h2>
          <p className="muted">This study session may have been deleted or the link is invalid.</p>
          <button type="button" className="primary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { digest } = session;
  const questionCount = digest.quiz?.questions?.length || 0;
  const flashcardCount = digest.flashcards?.length || 0;

  const handleDelete = () => {
    if (window.confirm("Delete this session?")) {
      sessionsHook.deleteSession(id);
      navigate("/");
    }
  };

  return (
    <div className="page-shell session-shell">
      <header className="session-header page-card">
        <div className="session-header-left">
          <button type="button" className="ghost-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
        </div>
        <div className="session-header-center">
          <h1>{session.topic}</h1>
          <SubjectBadge subject={session.subject} />
        </div>
        <div className="session-header-right">
          <ExportButton session={session} />
          <button type="button" className="secondary small" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </header>

      <section className="session-meta-row page-card">
        <span className="meta-pill">{session.subject}</span>
        <span className="meta-pill">{getDifficultyLabel(session.difficulty)}</span>
        <span className="meta-pill">{session.word_count} words</span>
        <span className="meta-pill">{formatDate(session.created_at)}</span>
        <span className="meta-pill">{questionCount} questions</span>
        <span className="meta-pill">{flashcardCount} flashcards</span>
      </section>

      <nav className="tab-bar page-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tab-pane">
        {activeTab === "summary" && <SummaryView summary={digest.summary} />}
        {activeTab === "quiz" && (
          <QuizView quiz={digest.quiz} onReviewFlashcards={() => setActiveTab("flashcards")} />
        )}
        {activeTab === "flashcards" && <FlashcardDeck flashcards={digest.flashcards} />}
      </main>
    </div>
  );
}
