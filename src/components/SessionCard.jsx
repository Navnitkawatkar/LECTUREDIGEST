import { Link } from "react-router-dom";
import { Trash2, ChevronRight } from "lucide-react";
import SubjectBadge from "./SubjectBadge";
import { formatDate, getDifficultyLabel, truncate } from "../lib/utils";

export default function SessionCard({ session, onDelete }) {
  return (
    <article className="session-card page-card">
      <button type="button" className="session-delete" onClick={onDelete} aria-label="Delete session">
        <Trash2 size={16} />
      </button>
      <div className="session-card-header">
        <SubjectBadge subject={session.subject} />
        <Link to={`/session/${session.id}`} className="session-link">
          Continue Studying <ChevronRight size={16} />
        </Link>
      </div>
      <h3>{session.topic}</h3>
      <p className="session-copy">{truncate(session.notes_preview, 80)}</p>
      <div className="session-meta">
        <span>{formatDate(session.created_at)}</span>
        <span>{session.word_count} words</span>
      </div>
      <div className="session-stats-row">
        <span>{session.digest.summary.key_concepts.length} concepts</span>
        <span>{session.digest.quiz.questions.length} questions</span>
        <span>{session.digest.flashcards.length} cards</span>
      </div>
      <Link to={`/session/${session.id}`} className="session-cta">
        Continue Studying
      </Link>
    </article>
  );
}
