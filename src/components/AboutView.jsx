import { Link } from "react-router-dom";

// A short "About" page explaining the data source and what the two charts show.
function AboutView() {
  return (
    <div className="panel">
      <div className="about-hero">
        <Link to="/" className="back-link">← Back to dashboard</Link>
        <h1 className="detail-title">About</h1>
        <p className="about-lead">
          A small dashboard for beating boredom — search real activity ideas, open any one for the
          full details, and share a direct link to it.
        </p>
      </div>

      <div className="detail-info">
        <div className="info-card">
          <div className="meta-key">Data source</div>
          <div className="info-text">
            Activities are pulled live from the{" "}
            <a href="https://bored-api.appbrewery.com" target="_blank" rel="noopener noreferrer">
              Bored API
            </a>{" "}
            across all seven categories.
          </div>
        </div>
        <div className="info-card">
          <div className="meta-key">The charts</div>
          <div className="info-text">
            <strong>What kind of cure?</strong> ranks how many ideas fall in each category.{" "}
            <strong>Quick fix or a project?</strong> groups activities by time commitment and splits
            each by whether they're free or paid.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutView;
