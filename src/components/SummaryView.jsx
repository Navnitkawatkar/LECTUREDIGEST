import { getImportanceStyle } from "../lib/utils";

export default function SummaryView({ summary }) {
  const concepts = summary.key_concepts || [];
  const facts = summary.key_facts || [];

  return (
    <div className="summary-view page-card">
      <section className="overview-card">
        <h2>Overview</h2>
        <p>{summary.overview}</p>
        <div className="takeaway-box">
          <span className="takeaway-label">Key Takeaway</span>
          <p className="takeaway-copy">{summary.takeaway}</p>
        </div>
      </section>

      <section className="concepts-section">
        <div className="section-heading-row">
          <h3>Key Concepts ({concepts.length})</h3>
        </div>
        <div className="concept-grid">
          {concepts.map((item) => (
            <article key={item.term} className="concept-card page-card">
              <div className="concept-card-header">
                <h4>{item.term}</h4>
                <span className="importance-badge" style={getImportanceStyle(item.importance)}>
                  {item.importance || "medium"}
                </span>
              </div>
              <p>{item.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="key-facts-section">
        <h3>Key Facts</h3>
        <div className="facts-list">
          {facts.map((fact, index) => (
            <div key={fact} className="fact-row">
              <div className="fact-badge">{index + 1}</div>
              <p>{fact}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
