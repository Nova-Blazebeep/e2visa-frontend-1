"use client";

import { Children, cloneElement, useCallback, useEffect, useRef, useState } from "react";

function Arrow({ direction, onClick }) {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Previous" : "Next"}
      className={`absolute ${isLeft ? "-left-4" : "-right-4"} top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#2EC4B6] hover:bg-[#25a99d] shadow-lg flex items-center justify-center transition-colors`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {isLeft ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

// A lightweight, dependency-free horizontal card slider: native scroll + snap,
// with arrow buttons that scroll by one card width. Avoids the width-distribution
// quirks of carousel libraries like react-slick that let card widths drift from
// the fixed size used elsewhere on the site.
//
// With autoplay, the card list is duplicated back-to-back and continuously
// scrolled at a constant speed via requestAnimationFrame; once it passes the
// width of one full set, the scroll position is silently rewound by that same
// width — since the next set is an identical copy, the wrap is invisible,
// producing a seamless loop. Hovering anywhere over the slider pauses it.
export default function CardSlider({ children, autoplay = false, speed = 30 }) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const items = autoplay
    ? [
        ...Children.toArray(children),
        ...Children.toArray(children).map((c) => cloneElement(c, { key: `dup-${c.key}` })),
      ]
    : children;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    if (autoplay) return; // arrows are always shown in autoplay/loop mode
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, children, autoplay]);

  useEffect(() => {
    if (!autoplay) return;
    const el = scrollRef.current;
    if (!el) return;

    let frameId;
    let lastTime = null;

    const step = (time) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isHovered) {
        const singleSetWidth = el.scrollWidth / 2;
        let next = el.scrollLeft + speed * dt;
        if (singleSetWidth > 0 && next >= singleSetWidth) next -= singleSetWidth;
        el.scrollLeft = next;
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [autoplay, isHovered, speed, children]);

  const scrollByCard = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-slider-card]");
    const gap = 32; // matches gap-8
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Capped to fit exactly N full 280px cards (+32px gaps) per breakpoint, so the
  // track never shows a sliver of the next card peeking in — only whole cards,
  // with the rest reachable via the arrows.
  // 1 card: 280 · 2 cards: 592 · 3 cards: 904 · 4 cards: 1216
  return (
    <div
      className="relative mx-auto max-w-[280px] sm:max-w-[592px] lg:max-w-[904px] xl:max-w-[1216px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(autoplay || canScrollLeft) && <Arrow direction="left" onClick={() => scrollByCard(-1)} />}
      <div
        ref={scrollRef}
        className={`flex gap-8 overflow-x-auto scrollbar-hide pb-2 ${autoplay ? '' : 'scroll-smooth snap-x snap-mandatory'}`}
      >
        {items}
      </div>
      {(autoplay || canScrollRight) && <Arrow direction="right" onClick={() => scrollByCard(1)} />}
    </div>
  );
}
