import { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { InkLogo } from "@/components/InkLogo";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [subject, setSubject] = useState("Enterprise inquiry");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      const mailtoBody = `Name: ${name}\nOrganization: ${organization}\nSubject: ${subject}\n\n${message}`;
      window.location.href = `mailto:contact@ink-grants.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
      toast.success("Opening your email client...");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <InkLogo size={24} />
          </Link>
          <Link to="/landing" className="text-[12px] font-semibold text-foreground/70 hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-[560px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-10">
          <h1 className="text-[28px] sm:text-[36px] font-extrabold text-foreground tracking-[-0.04em] leading-[1.1] mb-3">
            Get in touch
          </h1>
          <p className="text-[14px] text-foreground/70 leading-relaxed max-w-[440px]">
            Tell us about your organization and funding needs. We typically respond within one business day.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-1.5">
                Full name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                maxLength={100}
                className="w-full px-4 py-3 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-1.5">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@organization.com"
                required
                maxLength={255}
                className="w-full px-4 py-3 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-1.5">
              Organization
            </label>
            <input
              type="text"
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              placeholder="Your organization name"
              maxLength={200}
              className="w-full px-4 py-3 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-[4px] text-[14px] text-foreground focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all"
            >
              <option>Enterprise inquiry</option>
              <option>Partnership opportunity</option>
              <option>Technical support</option>
              <option>General question</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-1.5">
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us about your needs, team size, and timeline..."
              required
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 bg-background border border-border rounded-[4px] text-[14px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-info/60 focus:ring-2 focus:ring-info/15 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 bg-foreground text-background text-[13px] font-bold tracking-wide rounded-[4px] hover:bg-foreground/90 active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send message"}
            <Send className="h-3.5 w-3.5" />
          </button>

          <p className="text-[11px] text-foreground/55 text-center">
            Or email us directly at <a href="mailto:contact@ink-grants.com" className="text-info hover:underline">contact@ink-grants.com</a>
          </p>
        </form>
      </main>
    </div>
  );
}
