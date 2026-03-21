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
        {/* Mantle / Head */}
        <ellipse cx="32" cy="20" rx="13" ry="15" fill="hsl(18 72% 46%)" />
        <ellipse cx="36" cy="18" rx="7" ry="10" fill="hsl(18 72% 56%)" opacity="0.35" />
        {/* Warm highlight */}
        <ellipse cx="39" cy="14" rx="3.5" ry="5" fill="hsl(32 85% 55%)" opacity="0.3" />
        {/* Eyes */}
        <circle cx="27" cy="20" r="3.2" fill="white" />
        <circle cx="37" cy="20" r="3.2" fill="white" />
        <circle cx="27.8" cy="20" r="1.6" fill="hsl(18 72% 20%)" />
        <circle cx="37.8" cy="20" r="1.6" fill="hsl(18 72% 20%)" />
        {/* 8 Tentacles — evenly spread like a real octopus */}
        {/* Arm 1 — far left */}
        <path d="M19 32 Q10 38 6 48 Q4 53 7 54" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 2 */}
        <path d="M21 34 Q14 43 11 53 Q9 57 12 58" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 3 */}
        <path d="M25 35 Q21 46 19 56 Q18 60 21 60" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 4 — center-left */}
        <path d="M29 36 Q28 48 28 58 Q28 62 31 61" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 5 — center-right */}
        <path d="M35 36 Q36 48 36 58 Q36 62 33 61" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 6 */}
        <path d="M39 35 Q43 46 45 56 Q46 60 43 60" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 7 */}
        <path d="M43 34 Q50 43 53 53 Q55 57 52 58" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Arm 8 — far right */}
        <path d="M45 32 Q54 38 58 48 Q60 53 57 54" stroke="hsl(18 72% 46%)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Suction cup dots on a few arms */}
        <circle cx="9" cy="49" r="1" fill="hsl(18 72% 56%)" opacity="0.5" />
        <circle cx="14" cy="52" r="1" fill="hsl(18 72% 56%)" opacity="0.5" />
        <circle cx="50" cy="52" r="1" fill="hsl(18 72% 56%)" opacity="0.5" />
        <circle cx="55" cy="49" r="1" fill="hsl(18 72% 56%)" opacity="0.5" />
      </svg>
      {showText && (
        <span className={cn("font-extrabold text-foreground tracking-[-0.04em] text-[17px]", textClassName)}>
          INK
        </span>
      )}
    </div>
  );
}
