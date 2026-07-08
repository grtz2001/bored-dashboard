import Spotlight from "./Spotlight.jsx";

// The top banner: data-source badge, tagline, and the "roll again" spotlight.
// The `{ ... }` in the parameters pulls values straight out of the props object.
function Hero({ sourceLabel, sourceDot, pick, onSurprise }) {
  return (
    <div className="hero">
      <div className="source-badge">
        {/* Colored dot whose fill is set by a prop (green = live, etc.) */}
        <span className="source-dot" style={{ background: sourceDot }} />
        {sourceLabel}
      </div>
      <h1 className="hero-title">Bored? Let's fix that.</h1>
      <p className="hero-sub">
        Real things to do, pulled live from the Bored API. Search, filter, and
        pick something worth your afternoon.
      </p>

      {/* Only render the spotlight once we actually have a picked activity */}
      {pick && <Spotlight pick={pick} onSurprise={onSurprise} />}
    </div>
  );
}

export default Hero;
