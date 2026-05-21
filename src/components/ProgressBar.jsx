export default function ProgressBar({ value, max = 100, label }) {
  const percent = max ? Math.round((value / max) * 100) : 0;

  return (
    <div className="progress-block">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-value">{percent}%</span>
    </div>
  );
}
