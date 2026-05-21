import { Loader2 } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function LoadingDigest({ progress }) {
  return (
    <section className="loading-card page-card">
      <div className="loading-icon">
        <Loader2 size={48} className="spin" />
      </div>
      <h2>Groq is analyzing your notes...</h2>
      <p className="muted">This can take a moment while your study digest is being assembled.</p>
      <ProgressBar value={Math.min(90, (Date.now() / 1000) % 100)} max={100} label={progress} />
    </section>
  );
}
