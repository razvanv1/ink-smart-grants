import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Check, ExternalLink } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────

interface OrgData {
  id: string;
  name: string;
  type: string | null;
  country: string | null;
  size: string | null;
}

interface NotifPrefs {
  deadline_reminders: boolean;
  agent_risk_alerts: boolean;
  weekly_digest: boolean;
}

const DEFAULT_NOTIFS: NotifPrefs = {
  deadline_reminders: true,
  agent_risk_alerts: true,
  weekly_digest: false,
};

// ── Main ──────────────────────────────────────────────────────────

const SettingsPage = () => {
  const { user } = useAuth();

  // Org state
  const [org, setOrg] = useState<OrgData | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgEditing, setOrgEditing] = useState(false);
  const [orgDraft, setOrgDraft] = useState<Partial<OrgData>>({});

  // Notifications
  const [notifs, setNotifs] = useState<NotifPrefs>(DEFAULT_NOTIFS);
  const [notifsLoading, setNotifsLoading] = useState(true);
  const [notifSaving, setNotifSaving] = useState<string | null>(null);

  // Team
  const [team, setTeam] = useState<{ user_id: string; role: string }[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  // ── Fetch org via membership ───────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setOrgLoading(true);
      try {
        const { data: membership } = await supabase
          .from("organization_members")
          .select("organization_id, role")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membership) {
          const { data: orgRow } = await supabase
            .from("organizations")
            .select("id, name, type, country, size")
            .eq("id", membership.organization_id)
            .single();

          if (orgRow) setOrg(orgRow);

          // Load team
          setTeamLoading(true);
          const { data: members } = await supabase
            .from("organization_members")
            .select("user_id, role")
            .eq("organization_id", membership.organization_id);
          setTeam(members || []);
          setTeamLoading(false);
        }
      } catch {
        // silent
      } finally {
        setOrgLoading(false);
      }
    };
    load();
  }, [user]);

  // ── Fetch notification prefs ───────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setNotifsLoading(true);
      const { data } = await supabase
        .from("notification_preferences")
        .select("deadline_reminders, agent_risk_alerts, weekly_digest")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setNotifs({
          deadline_reminders: data.deadline_reminders,
          agent_risk_alerts: data.agent_risk_alerts,
          weekly_digest: data.weekly_digest,
        });
      }
      setNotifsLoading(false);
    };
    load();
  }, [user]);

  // ── Save org ───────────────────────────────────────────────────
  const saveOrg = async () => {
    if (!org) return;
    setOrgSaving(true);
    const { error } = await supabase
      .from("organizations")
      .update({
        name: orgDraft.name ?? org.name,
        type: orgDraft.type ?? org.type,
        country: orgDraft.country ?? org.country,
        size: orgDraft.size ?? org.size,
      })
      .eq("id", org.id);

    if (error) {
      toast.error("Failed to save organization");
    } else {
      setOrg({ ...org, ...orgDraft });
      setOrgEditing(false);
      setOrgDraft({});
      toast.success("Organization updated");
    }
    setOrgSaving(false);
  };

  // ── Toggle notification ────────────────────────────────────────
  const toggleNotif = async (key: keyof NotifPrefs) => {
    if (!user) return;
    setNotifSaving(key);
    const newVal = !notifs[key];
    const updated = { ...notifs, [key]: newVal };

    const { error } = await supabase
      .from("notification_preferences")
      .upsert(
        { user_id: user.id, ...updated },
        { onConflict: "user_id" }
      );

    if (error) {
      toast.error("Failed to save preference");
    } else {
      setNotifs(updated);
    }
    setNotifSaving(null);
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-[800px] mx-auto space-y-10">
      <div className="border-b border-border pb-6">
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-medium mb-2">Configuration</p>
        <h1 className="ink-page-title">Settings</h1>
      </div>

      {/* ── Account ─────────────────────────────────────────── */}
      <Section title="Account">
        <div className="grid sm:grid-cols-2 gap-y-5 gap-x-10">
          <Field label="Email" value={user?.email || "—"} />
          <Field label="User ID" value={user?.id?.slice(0, 8) + "…" || "—"} />
          <Field label="Provider" value={user?.app_metadata?.provider || "email"} />
          <Field label="Last sign-in" value={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "—"} />
        </div>
      </Section>

      {/* ── Organization ────────────────────────────────────── */}
      <Section
        title="Organization"
        action={org ? (orgEditing ? (orgSaving ? "Saving…" : "Save") : "Edit") : undefined}
        onAction={org ? (orgEditing ? saveOrg : () => { setOrgEditing(true); setOrgDraft({}); }) : undefined}
      >
        {orgLoading ? (
          <LoadingSkeleton rows={4} />
        ) : !org ? (
          <p className="text-[13px] text-muted-foreground">No organization linked to your account yet.</p>
        ) : orgEditing ? (
          <div className="grid sm:grid-cols-2 gap-y-5 gap-x-10">
            <EditField label="Name" value={orgDraft.name ?? org.name} onChange={v => setOrgDraft({ ...orgDraft, name: v })} />
            <EditField label="Entity Type" value={orgDraft.type ?? org.type ?? ""} onChange={v => setOrgDraft({ ...orgDraft, type: v })} />
            <EditField label="Country" value={orgDraft.country ?? org.country ?? ""} onChange={v => setOrgDraft({ ...orgDraft, country: v })} />
            <EditField label="Size" value={orgDraft.size ?? org.size ?? ""} onChange={v => setOrgDraft({ ...orgDraft, size: v })} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-y-5 gap-x-10">
            <Field label="Name" value={org.name} />
            <Field label="Entity Type" value={org.type || "—"} />
            <Field label="Country" value={org.country || "—"} />
            <Field label="Size" value={org.size || "—"} />
          </div>
        )}
      </Section>

      {/* ── Team ────────────────────────────────────────────── */}
      <Section title="Team">
        {teamLoading ? (
          <LoadingSkeleton rows={3} />
        ) : team.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">No team members found.</p>
        ) : (
          team.map(m => (
            <div key={m.user_id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
              <p className="text-[13px] font-semibold text-foreground">{m.user_id === user?.id ? "You" : m.user_id.slice(0, 8) + "…"}</p>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold">{m.role}</span>
            </div>
          ))
        )}
      </Section>

      {/* ── Notifications ───────────────────────────────────── */}
      <Section title="Notifications">
        {notifsLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <div className="space-y-4">
            <Toggle label="Deadline reminders" on={notifs.deadline_reminders} saving={notifSaving === "deadline_reminders"} onToggle={() => toggleNotif("deadline_reminders")} />
            <Toggle label="Agent risk alerts" on={notifs.agent_risk_alerts} saving={notifSaving === "agent_risk_alerts"} onToggle={() => toggleNotif("agent_risk_alerts")} />
            <Toggle label="Weekly digest" on={notifs.weekly_digest} saving={notifSaving === "weekly_digest"} onToggle={() => toggleNotif("weekly_digest")} />
          </div>
        )}
      </Section>

      {/* ── Integrations ────────────────────────────────────── */}
      <Section title="Integrations">
        <p className="text-[12px] text-muted-foreground mb-4">Connect external services to enhance your workflow.</p>
        <div className="space-y-3">
          <IntRow name="Google Drive" description="Sync documents and templates" />
          <IntRow name="Slack" description="Get notifications and alerts" />
          <IntRow name="EU Funding Portal" description="Automatic call discovery" comingSoon />
        </div>
      </Section>

      {/* ── Data & Privacy ──────────────────────────────────── */}
      <Section title="Data & Privacy">
        <p className="text-[13px] text-muted-foreground leading-relaxed">All data is encrypted at rest and in transit. Your data is never shared with third parties or used for model training.</p>
      </Section>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────

function Section({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] tracking-[0.15em] uppercase font-bold text-foreground">{title}</h2>
        {action && (
          <button onClick={onAction} className="text-[11px] text-primary font-semibold hover:underline tracking-wide uppercase active:scale-[0.97] transition-transform">
            {action}
          </button>
        )}
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

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground tracking-[0.12em] uppercase font-medium mb-1">{label}</p>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-[13px] text-foreground bg-secondary border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
      />
    </div>
  );
}

function Toggle({ label, on, saving, onToggle }: { label: string; on: boolean; saving?: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-foreground">{label}</span>
      <button
        onClick={onToggle}
        disabled={saving}
        className="relative h-5 w-9 rounded-full transition-colors cursor-pointer disabled:opacity-60"
        style={{ backgroundColor: on ? 'hsl(var(--foreground))' : 'hsl(var(--border))' }}
      >
        {saving ? (
          <Loader2 className="absolute top-0.5 left-1/2 -translate-x-1/2 h-4 w-4 animate-spin text-background" />
        ) : (
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
        )}
      </button>
    </div>
  );
}

function IntRow({ name, description, comingSoon }: { name: string; description: string; comingSoon?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-[13px] text-foreground font-medium">{name}</span>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      {comingSoon ? (
        <span className="text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/40">Coming soon</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-semibold text-warning">
          <ExternalLink className="h-3 w-3" /> Placeholder
        </span>
      )}
    </div>
  );
}

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-5 bg-secondary rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
      ))}
    </div>
  );
}

export default SettingsPage;
