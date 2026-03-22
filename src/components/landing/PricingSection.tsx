import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const plans = [
  {
    name: "Starter",
    price: "€49",
    period: "per month",
    description: "For small teams beginning to systematize their funding pipeline.",
    features: [
      "1 active application workflow",
      "Bi-weekly opportunity scanning",
      "Standard AI drafting assistance",
      "Deadline reminders",
      "Email support",
    ],
    cta: "Start 14-Day Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "€149",
    period: "per month",
    description: "For organizations running multiple funding streams in parallel.",
    features: [
      "Up to 5 active application workflows",
      "Continuous EU and national program scanning",
      "Advanced AI builder with context integration",
      "Deadline tracking and workflow management",
      "Knowledge reuse from past applications",
      "Pipeline reporting and priority support",
    ],
    cta: "Start 14-Day Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact for pricing",
    description: "For large organizations, consortiums, and teams with complex requirements.",
    features: [
      "Custom workflow volume (5+ active)",
      "Locally fine-tuned models on organizational data",
      "White-label deployment & API access",
      "Multi-entity and consortium support",
      "Dedicated onboarding and account management",
      "SLA and custom reporting",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 sm:py-28">
      <ScrollReveal className="text-center mb-16" delay={80}>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-info mb-3">Pricing</p>
        <h2 className="text-[34px] sm:text-[40px] font-extrabold text-foreground tracking-[-0.04em] leading-[1.08] mb-4">
          Simple pricing. No long-term contracts.
        </h2>
        <p className="text-[16px] text-foreground/75 max-w-[560px] mx-auto leading-relaxed">
          Start free for 14 days. Full platform access, no credit card required.
        </p>
      </ScrollReveal>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan, i) => (
          <ScrollReveal key={plan.name} delay={140 + i * 90} className="flex">
          <div
            className={`relative rounded-[8px] border p-7 sm:p-8 flex flex-col w-full ${
              plan.popular
                ? "border-info/70 bg-info/[0.06] shadow-lg shadow-info/[0.15]"
                : "border-border bg-card shadow-sm"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase bg-info text-info-foreground px-3 py-1 rounded-[3px]">
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-[13px] font-bold text-foreground mb-2">{plan.name}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[36px] font-extrabold text-foreground tracking-[-0.04em] leading-none">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="text-[12px] text-foreground/70">{plan.period}</span>
                )}
              </div>
              {plan.price === "Custom" && (
                <span className="text-[12px] text-foreground/70">{plan.period}</span>
              )}
              <p className="text-[12px] text-foreground/70 mt-3 leading-relaxed">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[12px] text-foreground/90">
                  <Check className="h-3.5 w-3.5 text-info mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center mt-auto">
              <button
                onClick={() => navigate(plan.name === "Enterprise" ? "/contact" : "/auth")}
                className={`px-6 py-2.5 text-[12px] font-bold rounded-full inline-flex items-center gap-1.5 active:scale-[0.96] transition-all ${
                  plan.popular
                    ? "bg-info text-info-foreground hover:bg-info/85 shadow-md shadow-info/25 hover:shadow-lg hover:shadow-info/30"
                    : "bg-foreground text-background hover:bg-foreground/85 shadow-sm"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
