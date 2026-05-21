import { Info, Sparkles } from "lucide-react";
import { getDifficultyLabel } from "../lib/utils";

export default function NoteInput({
  notes,
  onNotesChange,
  difficulty,
  setDifficulty,
  customInstructions,
  setCustomInstructions,
  onSubmit,
  loading,
  disabled,
  count,
  error,
  onLoadSample,
  difficultyOptions,
}) {
  return (
    <div className="note-input-card page-card">
      <div className="field-group">
        <label className="field-label" htmlFor="lecture-notes">
          Paste your lecture notes
        </label>
        <textarea
          id="lecture-notes"
          className="text-area"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Paste your lecture notes here...\n(Minimum 50 words for best results)"
          minLength={50}
          rows={12}
        />
        <div className="text-foot-row">
          <span className="small-text">{getDifficultyLabel(difficulty)} study path selected</span>
          <span className="small-text">{count} words</span>
        </div>
      </div>

      <div className="options-row">
        <div className="difficulty-pill-row">
          {difficultyOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`pill-button ${difficulty === option.id ? "active" : ""}`}
              onClick={() => setDifficulty(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="focus-field">
          <label className="field-label" htmlFor="focus-instructions">
            Add focus area (optional)
          </label>
          <input
            id="focus-instructions"
            type="text"
            className="text-input"
            value={customInstructions}
            onChange={(event) => setCustomInstructions(event.target.value)}
            placeholder="e.g. focus on formulas, ignore examples"
          />
        </div>
      </div>

      {error && (
        <div className="error-card page-card">
          <div className="error-title">
            <Info size={18} /> Error
          </div>
          <p className="error-copy">{error}</p>
          <button type="button" className="secondary" onClick={onSubmit}>
            Try Again
          </button>
        </div>
      )}

      <button type="button" className="primary action-button" onClick={onSubmit} disabled={disabled || loading}>
        {loading ? "Digesting your notes…" : "Digest My Notes →"}
      </button>
    </div>
  );
}
