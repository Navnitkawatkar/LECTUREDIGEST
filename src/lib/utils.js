export const wordCount = (text) => {
  return text?.trim() ? text.trim().split(/\s+/).length : 0;
};

export const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const truncate = (text, length = 100) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
};

export const generateExcerpt = (text, length = 120) => {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > length ? `${cleaned.slice(0, length).trim()}…` : cleaned;
};

export const buildSessionTitle = ({ topic, subject }) => {
  const safeTopic = topic || "Study Session";
  const safeSubject = subject || "General";
  return `${safeTopic} — ${safeSubject}`;
};

export const getDifficultyLabel = (difficulty) => {
  if (difficulty === "simple") return "Simple";
  if (difficulty === "deep") return "Deep";
  return "Standard";
};

export const getPerformanceLabel = (score, total) => {
  if (!total) return "Study mode";
  const ratio = (score / total) * 100;
  if (ratio === 100) return "Perfect Score! 🎉";
  if (ratio >= 80) return "Excellent! 🌟";
  if (ratio >= 60) return "Good job! 👍";
  if (ratio >= 40) return "Keep practicing 📚";
  return "Review your notes 🔄";
};

export const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const getSubjectStyle = (subject) => {
  const normalized = subject?.toLowerCase()?.trim() || "general";
  const palette = {
    biology: { background: "#eef6ff", color: "#1d4ed8" },
    chemistry: { background: "#fff7ed", color: "#c2410c" },
    physics: { background: "#eef2ff", color: "#4f46e5" },
    history: { background: "#f8fafc", color: "#475569" },
    math: { background: "#ecfdf5", color: "#166534" },
    literature: { background: "#f5f3ff", color: "#5b21b6" },
    economics: { background: "#fffbeb", color: "#b45309" },
    default: { background: "#eef2ff", color: "#4f46e5" },
  };

  return palette[normalized] || palette.default;
};

export const getImportanceStyle = (importance) => {
  if (importance === "high") return { background: "#fee2e2", color: "#991b1b" };
  if (importance === "medium") return { background: "#fef3c7", color: "#92400e" };
  return { background: "#dcfce7", color: "#166534" };
};
