import { cn } from "@/lib/utils";
import octopusImg from "@/assets/ink-octopus.png";

interface InkLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  textClassName?: string;
}

export function InkLogo({ size = 28, className, showText = true, showTagline = false, textClassName }: InkLogoProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <img
        src={octopusImg}
        alt="INK octopus"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
      {showText && (
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-extrabold text-foreground tracking-[-0.04em] text-[17px]", textClassName)}>
            INK
          </span>
          {showTagline && (
            <span className="text-[11px] font-semibold text-foreground/50 tracking-[-0.01em]">
              Smart Grants
            </span>
          )}
        </div>
      )}
    </div>
  );
}
