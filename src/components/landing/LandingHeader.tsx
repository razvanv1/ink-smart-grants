import { useNavigate } from "react-router-dom";
import inkLogo from "@/assets/ink-octopus-logo.png";

export function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/80">
      <div className="max-w-[1080px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={inkLogo} alt="INK" className="h-7 w-7 object-contain" />
          <span className="font-extrabold text-foreground tracking-[-0.04em] text-[17px]">INK</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#pricing" className="text-[12px] font-semibold text-foreground/75 hover:text-foreground transition-colors hidden sm:block">
            Pricing
          </a>
          <button
            onClick={() => navigate("/auth")}
            className="text-[12px] font-semibold text-foreground/90 hover:text-foreground transition-colors px-4 py-1.5 rounded-[3px] border border-foreground/20 bg-card hover:border-foreground/35"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
