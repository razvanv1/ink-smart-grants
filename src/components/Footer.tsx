import { Link } from "react-router-dom";
import { InkLogo } from "@/components/InkLogo";
import { Linkedin, Twitter, Mail } from "lucide-react";

interface FooterProps {
  variant?: "landing" | "app";
}

export function Footer({ variant = "landing" }: FooterProps) {
  const isApp = variant === "app";

  return (
    <footer className={`border-t border-border/40 ${isApp ? "bg-background py-6" : "bg-card/50 py-12 sm:py-16"}`}>
      <div className={`mx-auto px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-32 ${isApp ? "max-w-full" : "max-w-[1880px]"}`}>
        {!isApp && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 mb-10">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-1">
              <InkLogo size={24} className="mb-3" />
              <p className="text-[11px] text-foreground/60 leading-relaxed max-w-[200px]">
                A smart funding operations platform that monitors opportunities, selects the best grants, builds proposals faster with smart agents.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-[0.15em] mb-3">Product</p>
              <ul className="space-y-2">
                <li><a href="#scan-form" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">Free Scan</a></li>
                <li><a href="#pricing" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-[0.15em] mb-3">Company</p>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">Contact</Link></li>
                <li><a href="https://unlearning.ro" target="_blank" rel="noopener noreferrer" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">The Unlearning School</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-[0.15em] mb-3">Legal</p>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/gdpr" className="text-[12px] text-foreground/60 hover:text-foreground transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${!isApp ? "pt-6 border-t border-border/30" : ""}`}>
          <div className="flex items-center gap-3">
            {isApp && <InkLogo size={18} />}
            <p className="text-[10px] text-foreground/70">
              © {new Date().getFullYear()} INK. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isApp && (
              <Link to="/contact" className="text-[11px] text-foreground/55 hover:text-foreground transition-colors flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Help & Contact
              </Link>
            )}
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/ink-grants" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a href="https://twitter.com/ink_grants" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a href="mailto:contact@ink-grants.com" className="text-foreground/40 hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
