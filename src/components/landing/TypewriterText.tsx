import { useState, useEffect } from "react";

interface TypewriterTextProps {
  phrases: string[];
  className?: string;
}

export function TypewriterText({ phrases, className = "" }: TypewriterTextProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentPhrase];

    if (!isDeleting && currentChar < phrase.length) {
      const timeout = setTimeout(() => setCurrentChar(c => c + 1), 60 + Math.random() * 40);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && currentChar === phrase.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentChar > 0) {
      const timeout = setTimeout(() => setCurrentChar(c => c - 1), 30);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentChar === 0) {
      setIsDeleting(false);
      setCurrentPhrase(p => (p + 1) % phrases.length);
    }
  }, [currentChar, isDeleting, currentPhrase, phrases]);

  const displayed = phrases[currentPhrase].slice(0, currentChar);

  // Find the longest phrase to reserve stable width and prevent layout shifts
  const longestPhrase = phrases.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span className={`${className} relative inline-block`}>
      {/* Invisible longest phrase to reserve width */}
      <span className="invisible whitespace-pre" aria-hidden="true">{longestPhrase}</span>
      {/* Visible typewriter text overlaid */}
      <span className="absolute left-0 top-0 whitespace-pre">
        {displayed}
        <span className="border-r-[3px] border-current text-current animate-typewriter-cursor ml-0.5">&nbsp;</span>
      </span>
    </span>
  );
}
