import { Building2, Users, Bell, Plug, User, Shield } from "lucide-react";

const sections = [
  {
    title: 'Organization Settings',
    icon: <Building2 className="h-4 w-4" />,
    fields: [
      { label: 'Organization Name', value: 'The Unlearning School' },
      { label: 'Legal Entity Type', value: 'Non-Profit Association' },
      { label: 'Registration Country', value: 'Greece' },
      { label: 'PIC Number', value: '998745632' },
    ],
  },
  {
    title: 'Users & Roles',
    icon: <Users className="h-4 w-4" />,
    users: [
      { name: 'Elena P.', role: 'Admin', email: 'elena@unlearning.school' },
      { name: 'Maria K.', role: 'Grant Manager', email: 'maria@unlearning.school' },
      { name: 'Nikos T.', role: 'Team Member', email: 'nikos@unlearning.school' },
    ],
  },
];

const SettingsPage = () => {
  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your organization and preferences</p>
      </div>

      {/* Organization */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Organization Settings</h2>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-4">
          {sections[0].fields?.map(f => (
            <div key={f.label}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-sm text-foreground">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Users & Roles</h2>
          </div>
          <button className="text-xs text-primary font-medium hover:underline">Invite User</button>
        </div>
        <div className="divide-y divide-border">
          {sections[1].users?.map(u => (
            <div key={u.email} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground px-2 py-1 rounded bg-muted">{u.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="p-4 space-y-3">
          <NotifRow label="Deadline reminders" description="Get notified 7, 3, and 1 days before deadlines" enabled />
          <NotifRow label="Agent activity alerts" description="Receive alerts when agents detect risks or opportunities" enabled />
          <NotifRow label="Weekly pipeline digest" description="Summary of pipeline changes every Monday" enabled={false} />
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Plug className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Integrations</h2>
        </div>
        <div className="p-4 space-y-3">
          <IntegrationRow name="EU Funding Portal" status="Connected" />
          <IntegrationRow name="Google Drive" status="Not connected" />
          <IntegrationRow name="Slack" status="Not connected" />
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Data & Privacy</h2>
        </div>
        <div className="p-4 text-sm text-muted-foreground space-y-2">
          <p>All data is encrypted at rest and in transit. Your organization's data is never shared with third parties or used to train AI models.</p>
          <button className="text-xs text-primary font-medium hover:underline">Export all data</button>
        </div>
      </div>
    </div>
  );
};

function NotifRow({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-primary' : 'bg-muted'}`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </div>
  );
}

function IntegrationRow({ name, status }: { name: string; status: string }) {
  const connected = status === 'Connected';
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-foreground">{name}</p>
      <span className={`text-xs font-medium ${connected ? 'text-success' : 'text-muted-foreground'}`}>{status}</span>
    </div>
  );
}

export default SettingsPage;
