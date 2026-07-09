"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

const ROTATE_MS = 9000;
const FADE_MS = 500;

/**
 * Ambient rotating quote for the canvas negative space (desktop only). Starts
 * on a random quote after mount — deferred out of the initial render so server
 * and client agree on the first paint — then crossfades to the next every few
 * seconds. Hovering pauses the rotation so a quote can be read in full. Low
 * contrast on purpose: atmosphere, never competing with the card.
 */
export function Quotes() {
  const { dict } = useI18n();
  const quotes = dict.quotes;

  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  // Pause-on-hover. A ref (not state) so the interval reads the live value
  // without needing to be torn down and recreated on every hover.
  const pausedRef = useRef(false);
  // The in-flight fade timeout, tracked so cleanup can cancel it (avoids a
  // setState after unmount and overlapping fades when quotes change).
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Random starting quote, post-mount to avoid a hydration mismatch: the server
  // and first client render both use index 0, then the client picks a random
  // one. This is the sanctioned "randomize after mount" effect, so the
  // set-state-in-effect lint rule doesn't apply.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setI(Math.floor(Math.random() * quotes.length));
    setShow(true);
  }, [quotes.length]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setShow(false);
      fadeTimerRef.current = setTimeout(() => {
        setI((v) => (v + 1) % quotes.length);
        setShow(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => {
      clearInterval(id);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [quotes.length]);

  const quote = quotes[i];

  return (
    <figure
      className="ml-auto w-fit text-right transition-opacity ease-out"
      style={{ opacity: show ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <blockquote className="text-muted-foreground/70 font-serif text-[13px] leading-relaxed text-balance italic">
        “{quote.text}”
      </blockquote>
      <figcaption className="text-muted-foreground/50 mt-1.5 text-[11px] tracking-wide">
        — {quote.author}
      </figcaption>
    </figure>
  );
}
