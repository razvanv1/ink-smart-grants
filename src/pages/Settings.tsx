import { currentOrganization } from "@/data/sampleData";

const teamMembers = [
  { name: 'Elena P.', role: 'Admin', email: 'elena@unlearning.school' },
  { name: 'Maria K.', role: 'Grant Manager', email: 'maria@unlearning.school' },
  { name: 'Nikos T.', role: 'Member', email: 'nikos@unlearning.school' },
];

const SettingsPage = () => {
  return (
    <div className="p-8 max-w-[800px] mx-auto space-y-10">
      <div className="border-b border-border pb-6">
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Configuration</p>
        <h1 className="ink-page-title">Settings</h1>
      </div>

      <Section title="Organization">
        <div className="grid sm:grid-cols-2 gap-y-5 gap-x-10">
          <Field label="Name" value={currentOrganization.name} />
          <Field label="Entity Type" value={currentOrganization.type} />
          <Field label="Country" value={currentOrganization.country} />
          <Field label="PIC Number" value="998745632" />
        </div>
      </Section>

      <Section title="Team" action="Invite">
        {teamMembers.map(u => (
          <div key={u.email} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
            <div>
              <p className="text-[13px] font-semibold text-foreground">{u.name}</p>
              <p className="text-[11px] text-muted-foreground">{u.email}</p>
            </div>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold">{u.role}</span>
          </div>
        ))}
      </Section>

      <Section title="Notifications">
        <div className="space-y-4">
          <Toggle label="Deadline reminders" on />
          <Toggle label="Agent risk alerts" on />
          <Toggle label="Weekly digest" on={false} />
        </div>
      </Section>

      <Section title="Integrations">
        <div className="space-y-3">
          <IntRow name="EU Funding Portal" connected />
          <IntRow name="Google Drive" />
          <IntRow name="Slack" />
        </div>
      </Section>

      <Section title="Data & Privacy">
        <p className="text-[13px] text-muted-foreground leading-relaxed">Encrypted at rest and in transit. Never shared or used for training.</p>
        <button className="text-[11px] text-primary font-semibold hover:underline mt-2 tracking-wide uppercase">Export Data</button>
      </Section>
    </div>
  );
};

function Section({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] tracking-[0.15em] uppercase font-bold text-foreground">{title}</h2>
        {action && <button className="text-[11px] text-primary font-semibold hover:underline tracking-wide uppercase">{action}</button>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium">{label}</p>
      <p className="text-[13px] text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-foreground">{label}</span>
      <div className={`h-4 w-8 rounded-full relative cursor-pointer transition-colors ${on ? 'bg-foreground' : 'bg-border'}`}>
        <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-background transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </div>
  );
}

function IntRow({ name, connected }: { name: string; connected?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-foreground">{name}</span>
      <span className={`text-[10px] tracking-wider uppercase font-semibold ${connected ? 'text-success' : 'text-muted-foreground/40'}`}>
        {connected ? 'Connected' : '—'}
      </span>
    </div>
  );
}

export default SettingsPage;
