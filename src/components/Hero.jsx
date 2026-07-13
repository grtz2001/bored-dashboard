import Spotlight from "./Spotlight.jsx";

// The top banner: tagline plus the "roll again" spotlight. The data-source
// badge now lives in the shared sidebar.
function Hero({ pick, onOpen, onSurprise }) {
  return (
    <div className="hero">
      <h1 className="hero-title">Bored? Let's fix that.</h1>
      <p className="hero-sub">
        Real things to do, pulled live from the Bored API. Search, filter, chart
        the mood, and pick something worth your afternoon.
      </p>

      {/* Only render the spotlight once we actually have a picked activity */}
      {pick && <Spotlight pick={pick} onOpen={onOpen} onSurprise={onSurprise} />}
    </div>
  );
}

export default Hero;
