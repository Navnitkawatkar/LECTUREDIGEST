import { getSubjectStyle } from "../lib/utils";

export default function SubjectBadge({ subject }) {
  const style = getSubjectStyle(subject);

  return (
    <span className="subject-badge" style={{ background: style.background, color: style.color }}>
      {subject || "General"}
    </span>
  );
}
