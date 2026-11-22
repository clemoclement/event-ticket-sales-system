import { useState, useEffect, useRef, useCallback } from "react";
import "./HeroSlider.css";

// Replace with your real events / banners.
// Put images in /public/banners and reference them as "/banners/xxx.jpg".
const DEFAULT_SLIDES = [
  {
    id: 1,
    image: "/banners/concert.jpg",
    title: "Live concerts this weekend",
    subtitle: "Get your tickets before they sell out.",
    cta: "Browse concerts",
    href: "/events?category=music",
  },
  {
    id: 2,
    image: "/banners/festival.jpg",
    title: "Festival season is here",
    subtitle: "Early-bird prices end Friday.",
    cta: "See festivals",
    href: "/events?category=festival",
  },
  {
    id: 3,
    image: "/banners/comedy.jpg",
    title: "Comedy nights",
    subtitle: "Book a table with your friends.",
    cta: "Find shows",
    href: "/events?category=comedy",
  },
];

function HeroSlider({ slides = DEFAULT_SLIDES, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const count = slides.length;

  const goTo = useCallback((i) => setIndex((i + count) % count), [count]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance. Restarts whenever the slide changes, so a manual
  // click gives the user a full interval before the next auto-slide.
  useEffect(() => {
    if (paused || count < 2) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
  }, [index, paused, interval, next, count]);

  function onKeyDown(e) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  }

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured events"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="hero-slider__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            className="hero-slider__slide"
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-slider__content">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
              <a
                className="hero-slider__cta"
                href={slide.href}
                tabIndex={i === index ? 0 : -1}
              >
                {slide.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="hero-slider__arrow hero-slider__arrow--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-slider__arrow hero-slider__arrow--next"
            onClick={next}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="hero-slider__dots">
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide.id}
                className={i === index ? "is-active" : ""}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HeroSlider;
