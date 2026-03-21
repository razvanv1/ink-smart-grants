import { useNavigate } from "react-router-dom";
import { InkLogo } from "@/components/InkLogo";

export function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/80">
      <div className="w-full px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-32 h-16 flex items-center justify-between max-w-[1880px] mx-auto">
        <InkLogo size={30} />
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
