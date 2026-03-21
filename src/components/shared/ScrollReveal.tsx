import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  once?: boolean;
  amount?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.18,
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: amount },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, amount]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:transition-none",
        isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-6 blur-[4px] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:blur-0",
        className,
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}