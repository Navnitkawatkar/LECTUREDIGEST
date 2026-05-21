import { useState } from "react";
import { Download, Copy, FileText } from "lucide-react";
import { formatDate } from "../lib/utils";

const buildSummaryText = (session) => {
  const { topic, subject, created_at, digest } = session;
  const concepts = digest.summary.key_concepts || [];
  const facts = digest.summary.key_facts || [];
  const questions = digest.quiz.questions || [];
  const cards = digest.flashcards || [];

  const quizText = questions
    .map((question, index) => {
      const answer = question.options?.[question.correct] || "";
      return `Q${index + 1}. ${question.question}\nAnswer: ${answer}\n`;
    })
    .join("\n");

  const flashcardText = cards
    .map((card) => `${card.term} → ${card.definition}`)
    .join("\n");

  return [`═══════════════════════`, `LECTUREDIGEST REPORT`, `Topic: ${topic}`, `Subject: ${subject}`, `Date: ${formatDate(created_at)}`, `═══════════════════════`, ``, `SUMMARY`, `────────────`, digest.summary.overview, ``, `KEY CONCEPTS`, `────────────`, ...concepts.map((item, index) => `${index + 1}. ${item.term}: ${item.explanation}`), ``, `KEY FACTS`, `──────────`, ...facts.map((fact) => `• ${fact}`), ``, `QUIZ QUESTIONS (with answers)`, `──────────────────────────────`, quizText, ``, `FLASHCARDS`, `──────────`, flashcardText, ``, `═══════════════════════`].join("\n");
};

export default function ExportButton({ session }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText(session));
      setStatus("Copied to clipboard");
      setTimeout(() => setStatus(""), 2400);
    } catch {
      setStatus("Copy failed");
    }
    setOpen(false);
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    setOpen(false);
  };

  const handleDownloadTxt = () => {
    downloadFile(buildSummaryText(session), `LectureDigest-${session.topic}.txt`);
  };

  const handleDownloadJson = () => {
    downloadFile(JSON.stringify(session, null, 2), `LectureDigest-${session.topic}.json`);
  };

  return (
    <div className="export-dropdown">
      <button type="button" className="secondary small" onClick={() => setOpen((prev) => !prev)}>
        Export
      </button>
      {open && (
        <div className="export-menu page-card">
          <button type="button" className="export-action" onClick={handleCopy}>
            <Copy size={16} /> Copy Summary
          </button>
          <button type="button" className="export-action" onClick={handleDownloadTxt}>
            <FileText size={16} /> Download TXT
          </button>
          <button type="button" className="export-action" onClick={handleDownloadJson}>
            <Download size={16} /> Download JSON
          </button>
        </div>
      )}
      {status && <span className="export-status">{status}</span>}
    </div>
  );
}
