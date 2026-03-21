import { cn } from "@/lib/utils";

interface InkLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function InkLogo({ size = 28, className, showText = true, textClassName }: InkLogoProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Head */}
        <ellipse cx="32" cy="22" rx="14" ry="16" fill="hsl(212 86% 25%)" />
        <ellipse cx="36" cy="20" rx="8" ry="12" fill="hsl(212 86% 32%)" opacity="0.5" />
        {/* Eyes */}
        <circle cx="27" cy="22" r="3.5" fill="white" />
        <circle cx="37" cy="22" r="3.5" fill="white" />
        <circle cx="28" cy="22" r="1.8" fill="hsl(212 86% 15%)" />
        <circle cx="38" cy="22" r="1.8" fill="hsl(212 86% 15%)" />
        {/* Tentacles — 8 curves spreading outward */}
        <path d="M20 34 Q12 42 8 52" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M23 36 Q18 46 14 56" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M27 37 Q25 48 22 58" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M32 38 Q32 50 32 60" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M37 37 Q39 48 42 58" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M41 36 Q46 46 50 56" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M44 34 Q52 42 56 52" stroke="hsl(212 86% 25%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M46 31 Q54 36 60 44" stroke="hsl(212 86% 25%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Teal accent highlight */}
        <ellipse cx="40" cy="16" rx="4" ry="6" fill="hsl(172 50% 45%)" opacity="0.35" />
      </svg>
      {showText && (
        <span className={cn("font-extrabold text-foreground tracking-[-0.04em] text-[17px]", textClassName)}>
          INK
        </span>
      )}
    </div>
  );
}