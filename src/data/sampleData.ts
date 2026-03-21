// ── Enums (match these exactly across all pages) ──────────────────

export type OpportunityStatus = 'new' | 'watchlist' | 'shortlisted' | 'active-workflow' | 'ignored' | 'rejected';
export type WorkflowStage = 'Created' | 'Scoping' | 'Drafting' | 'Inputs Pending' | 'Review' | 'Compliance Check' | 'Ready to Submit' | 'Submitted';
export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'at-risk';
export type TaskStatus = 'todo' | 'in-progress' | 'waiting' | 'done' | 'blocked';
export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type Severity = 'info' | 'attention' | 'risk' | 'critical';
export type ReusePotential = 'high' | 'medium' | 'low';
export type AssetType = 'past-application' | 'project-description' | 'report' | 'proposal-fragment' | 'budget-template' | 'organization-doc';

export const workflowStages: WorkflowStage[] = [
  'Created', 'Scoping', 'Drafting', 'Inputs Pending', 'Review', 'Compliance Check', 'Ready to Submit', 'Submitted',
];

export const pipelineStages = [
  'Identified', 'Watchlist', 'Shortlisted', 'Active', 'In Review', 'Ready to Submit', 'Submitted',
] as const;

// ── Organization ──────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  type: string;
  country: string;
  domainFocus: string[];
  size: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export const currentOrganization: Organization = {
  id: 'org-1',
  name: 'The Unlearning School',
  type: 'Non-Profit / Social Enterprise',
  country: 'Greece',
  domainFocus: ['Digital Skills', 'Workforce Development', 'Education Innovation'],
  size: '12–20 staff',
  onboardingComplete: true,
  createdAt: '2025-06-01',
};

// ── Funding Profile ───────────────────────────────────────────────

export interface FundingProfile {
  organizationId: string;
  fundingGoals: string;
  preferredSources: string[];
  preferredTypes: string[];
  geographyPreferences: string[];
  budgetRange: string;
  partnershipReadiness: string;
  internalCapacity: string;
  priorExperience: string;
  excludedThemes: string[];
  notes: string;
  completeness: number;
  updatedAt: string;
}

export const fundingProfile: FundingProfile = {
  organizationId: 'org-1',
  fundingGoals: 'Expand training delivery across Southern and Eastern Europe. Build AI literacy programming. Strengthen consortium leadership capacity.',
  preferredSources: ['Horizon Europe', 'Erasmus+', 'Digital Europe', 'ESF+'],
  preferredTypes: ['RIA', 'Cooperation Partnership', 'CSA', 'National Grant'],
  geographyPreferences: ['EU-wide', 'Greece', 'Widening Countries'],
  budgetRange: '€150K – €4M',
  partnershipReadiness: 'Active network of 14 partners across 8 EU countries',
  internalCapacity: '3–4 concurrent workflows',
  priorExperience: '6 successful applications (Erasmus+ KA2, ESF+, national innovation grants)',
  excludedThemes: ['Military/defense', 'Nuclear energy', 'Fossil fuel extraction'],
  notes: 'Prioritizing digital skills and AI literacy calls. Seeking coordination roles.',
  completeness: 85,
  updatedAt: '2026-03-15',
};

// ── Funding Calls / Opportunities ─────────────────────────────────

export interface Opportunity {
  id: string;
  organizationId: string;
  callName: string;
  programme: string;
  sourceUrl: string;
  geography: string;
  thematicArea: string;
  fundingType: string;
  fundingRange: string;
  deadline: string;
  eligibility: string;
  complexity: 'low' | 'medium' | 'high';
  partnerRequired: boolean;
  summary: string;
  // Match fields
  fitScore: number;
  effortScore: number;
  urgency: Urgency;
  status: OpportunityStatus;
  recommendedAction: string;
  whyItFits: string;
  whyDifficult: string;
  createdAt: string;
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    organizationId: 'org-1',
    callName: 'HORIZON-CL4-2026-HUMAN-01-03',
    programme: 'Horizon Europe',
    sourceUrl: 'https://ec.europa.eu/funding-tenders',
    geography: 'EU-wide',
    fitScore: 92,
    effortScore: 68,
    urgency: 'high',
    deadline: '2026-05-15',
    status: 'shortlisted',
    recommendedAction: 'Start Workflow',
    fundingRange: '€2M – €4M',
    thematicArea: 'Digital Skills & AI Literacy',
    fundingType: 'RIA',
    summary: 'Research and innovation action targeting human-centric approaches to AI literacy in workforce transitions. Focus on upskilling frameworks, reusable curricula, and cross-sector pilot validation.',
    whyItFits: 'Strong alignment with org expertise in workforce development and digital skills training. Prior experience in Erasmus+ KA2 gives credibility for consortium leadership.',
    whyDifficult: 'Requires minimum 5-country consortium. Budget justification for AI tooling may face scrutiny. Tight 8-week window.',
    eligibility: 'Non-profit, HEI, or research org in EU member state',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-03-10',
  },
  {
    id: 'opp-2',
    organizationId: 'org-1',
    callName: 'ERASMUS-EDU-2026-PI-ALL-LOT1',
    programme: 'Erasmus+',
    sourceUrl: 'https://erasmus-plus.ec.europa.eu',
    geography: 'EU + Associated Countries',
    fitScore: 87,
    effortScore: 45,
    urgency: 'medium',
    deadline: '2026-06-22',
    status: 'shortlisted',
    recommendedAction: 'Review',
    fundingRange: '€250K – €400K',
    thematicArea: 'Partnerships for Innovation',
    fundingType: 'Cooperation Partnership',
    summary: 'Cooperation partnerships focused on innovation in education and training, with emphasis on digital transformation and green skills integration.',
    whyItFits: 'Direct match with organizational domain. Previous successful KA2 project provides strong track record evidence.',
    whyDifficult: 'Competitive call with high submission volume. Need to differentiate approach clearly.',
    eligibility: 'Any organization in programme countries',
    partnerRequired: true,
    complexity: 'medium',
    createdAt: '2026-03-08',
  },
  {
    id: 'opp-3',
    organizationId: 'org-1',
    callName: 'DIGITAL-2026-SKILLS-04',
    programme: 'Digital Europe',
    sourceUrl: 'https://digital-strategy.ec.europa.eu',
    geography: 'EU Member States',
    fitScore: 78,
    effortScore: 72,
    urgency: 'critical',
    deadline: '2026-04-08',
    status: 'active-workflow',
    recommendedAction: 'Continue Workflow',
    fundingRange: '€1.5M – €3M',
    thematicArea: 'Advanced Digital Skills',
    fundingType: 'Grant',
    summary: 'Deployment of advanced digital skills training programmes targeting SMEs and public sector organizations in underserved regions.',
    whyItFits: 'Org has established training delivery infrastructure. Strong regional networks for SME engagement.',
    whyDifficult: 'Co-financing requirement of 50%. Deployment-focused means less room for research activities.',
    eligibility: 'Legal entities in EU member states',
    partnerRequired: false,
    complexity: 'high',
    createdAt: '2026-02-20',
  },
  {
    id: 'opp-4',
    organizationId: 'org-1',
    callName: 'ESF-PLUS-2026-SKILLS-TRANSITION',
    programme: 'European Social Fund Plus',
    sourceUrl: 'https://ec.europa.eu/esf',
    geography: 'National (Greece)',
    fitScore: 84,
    effortScore: 38,
    urgency: 'low',
    deadline: '2026-09-30',
    status: 'watchlist',
    recommendedAction: 'Watch',
    fundingRange: '€150K – €500K',
    thematicArea: 'Skills for Green & Digital Transition',
    fundingType: 'National Grant',
    summary: 'National implementation of ESF+ priorities targeting skills development for green and digital transitions in the Greek labor market.',
    whyItFits: 'Operating in Greece with relevant training capacity. Can leverage existing curriculum assets.',
    whyDifficult: 'National procurement rules may limit flexibility. Reporting requirements are heavy.',
    eligibility: 'Registered organizations in Greece',
    partnerRequired: false,
    complexity: 'low',
    createdAt: '2026-03-01',
  },
  {
    id: 'opp-5',
    organizationId: 'org-1',
    callName: 'CERV-2026-CITIZENS-CIV',
    programme: 'CERV',
    sourceUrl: 'https://ec.europa.eu/cerv',
    geography: 'EU-wide',
    fitScore: 61,
    effortScore: 55,
    urgency: 'medium',
    deadline: '2026-07-18',
    status: 'new',
    recommendedAction: 'Needs More Info',
    fundingRange: '€75K – €200K',
    thematicArea: 'Citizens Engagement & Civic Participation',
    fundingType: 'Action Grant',
    summary: 'Supporting projects that promote civic participation and democratic engagement through innovative methods and digital tools.',
    whyItFits: 'Partial alignment through community engagement work. Could strengthen civic education portfolio.',
    whyDifficult: 'Not core domain. Would need to build new partnerships for this thematic area.',
    eligibility: 'Non-profit organizations in EU',
    partnerRequired: true,
    complexity: 'medium',
    createdAt: '2026-03-18',
  },
  {
    id: 'opp-6',
    organizationId: 'org-1',
    callName: 'INNOVFUND-2026-LSC-01',
    programme: 'Innovation Fund',
    sourceUrl: 'https://ec.europa.eu/clima/innovation-fund',
    geography: 'EU + EEA',
    fitScore: 42,
    effortScore: 88,
    urgency: 'low',
    deadline: '2026-10-15',
    status: 'ignored',
    recommendedAction: 'Ignore',
    fundingRange: '€7.5M – €30M',
    thematicArea: 'Clean Tech Manufacturing',
    fundingType: 'Large-Scale Project',
    summary: 'Large-scale demonstration of innovative clean technologies in manufacturing sectors with measurable CO2 reduction targets.',
    whyItFits: 'Limited overlap. Not core domain.',
    whyDifficult: 'Very high effort. Requires industrial partners and massive co-financing. Outside organizational capacity.',
    eligibility: 'Industrial entities with manufacturing capacity',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-03-05',
  },
  {
    id: 'opp-7',
    organizationId: 'org-1',
    callName: 'HORIZON-WIDERA-2026-ACCESS-02',
    programme: 'Horizon Europe',
    sourceUrl: 'https://ec.europa.eu/funding-tenders',
    geography: 'Widening Countries',
    fitScore: 73,
    effortScore: 52,
    urgency: 'medium',
    deadline: '2026-06-10',
    status: 'new',
    recommendedAction: 'Review',
    fundingRange: '€800K – €1.5M',
    thematicArea: 'ERA Talent & Capacity Building',
    fundingType: 'CSA',
    summary: 'Coordination and support actions to strengthen research and innovation ecosystems in widening countries through talent mobility and institutional capacity building.',
    whyItFits: 'Located in widening country. Experience with capacity building projects.',
    whyDifficult: 'CSA format requires strong coordination plan. Need to demonstrate systemic impact potential.',
    eligibility: 'Entities in widening countries',
    partnerRequired: true,
    complexity: 'medium',
    createdAt: '2026-03-19',
  },
  {
    id: 'opp-8',
    organizationId: 'org-1',
    callName: 'LIFE-2026-SAP-ENV',
    programme: 'LIFE Programme',
    sourceUrl: 'https://cinea.ec.europa.eu/life',
    geography: 'EU-wide',
    fitScore: 35,
    effortScore: 65,
    urgency: 'low',
    deadline: '2026-11-05',
    status: 'rejected',
    recommendedAction: 'Ignore',
    fundingRange: '€1M – €5M',
    thematicArea: 'Environmental Governance',
    fundingType: 'Standard Action Project',
    summary: 'Projects addressing environmental governance challenges including circular economy, biodiversity, and environmental compliance monitoring.',
    whyItFits: 'Minimal alignment with current organizational focus.',
    whyDifficult: 'Requires environmental domain expertise not currently in team.',
    eligibility: 'Public or private entities in EU',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-02-28',
  },
];

// ── Workflows ─────────────────────────────────────────────────────

export interface Workflow {
  id: string;
  organizationId: string;
  opportunityId: string;
  opportunityName: string;
  name: string;
  stage: WorkflowStage;
  owner: string;
  deadline: string;
  readinessScore: number;
  blockers: number;
  status: WorkflowStatus;
  nextMilestone: string;
  createdAt: string;
  updatedAt: string;
}

export const workflows: Workflow[] = [
  {
    id: 'wf-1',
    organizationId: 'org-1',
    name: 'DIGITAL-2026-SKILLS-04 Application',
    opportunityId: 'opp-3',
    opportunityName: 'DIGITAL-2026-SKILLS-04',
    stage: 'Drafting',
    owner: 'Maria K.',
    deadline: '2026-04-08',
    readinessScore: 64,
    blockers: 2,
    status: 'at-risk',
    nextMilestone: 'Complete budget annex',
    createdAt: '2026-02-25',
    updatedAt: '2026-03-20',
  },
  {
    id: 'wf-2',
    organizationId: 'org-1',
    name: 'Erasmus+ KA2 Innovation Partnership',
    opportunityId: 'opp-2',
    opportunityName: 'ERASMUS-EDU-2026-PI-ALL-LOT1',
    stage: 'Scoping',
    owner: 'Nikos T.',
    deadline: '2026-06-22',
    readinessScore: 28,
    blockers: 0,
    status: 'active',
    nextMilestone: 'Define consortium composition',
    createdAt: '2026-03-12',
    updatedAt: '2026-03-19',
  },
  {
    id: 'wf-3',
    organizationId: 'org-1',
    name: 'Horizon Europe AI Literacy Consortium',
    opportunityId: 'opp-1',
    opportunityName: 'HORIZON-CL4-2026-HUMAN-01-03',
    stage: 'Created',
    owner: 'Elena P.',
    deadline: '2026-05-15',
    readinessScore: 12,
    blockers: 1,
    status: 'active',
    nextMilestone: 'Confirm consortium composition',
    createdAt: '2026-03-18',
    updatedAt: '2026-03-20',
  },
];

// ── Tasks ─────────────────────────────────────────────────────────

export interface Task {
  id: string;
  workflowId: string;
  title: string;
  description?: string;
  taskType?: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  dependency?: string;
  createdAt: string;
}

export const tasks: Task[] = [
  { id: 't-1', title: 'Finalize partner budget inputs', owner: 'Maria K.', dueDate: '2026-03-28', status: 'blocked', workflowId: 'wf-1', dependency: 'TU Berlin response', createdAt: '2026-03-01' },
  { id: 't-2', title: 'Upload signed partnership declaration', owner: 'Nikos T.', dueDate: '2026-04-01', status: 'waiting', workflowId: 'wf-1', createdAt: '2026-03-05' },
  { id: 't-3', title: 'Review impact section draft', owner: 'Elena P.', dueDate: '2026-03-25', status: 'in-progress', workflowId: 'wf-1', createdAt: '2026-03-10' },
  { id: 't-4', title: 'Confirm consortium composition', owner: 'Elena P.', dueDate: '2026-04-10', status: 'todo', workflowId: 'wf-3', createdAt: '2026-03-18' },
  { id: 't-5', title: 'Draft project objectives', owner: 'Nikos T.', dueDate: '2026-04-15', status: 'todo', workflowId: 'wf-2', createdAt: '2026-03-12' },
  { id: 't-6', title: 'Complete budget annex', owner: 'Maria K.', dueDate: '2026-03-30', status: 'in-progress', workflowId: 'wf-1', createdAt: '2026-03-08' },
];

// ── Knowledge Assets ──────────────────────────────────────────────

export interface KnowledgeAsset {
  id: string;
  organizationId: string;
  title: string;
  type: AssetType;
  fileUrl?: string;
  source: string;
  tags: string[];
  reusePotential: ReusePotential;
  summary: string;
  uploadedBy: string;
  createdAt: string;
}

export const knowledgeAssets: KnowledgeAsset[] = [
  {
    id: 'ka-1',
    organizationId: 'org-1',
    title: 'KA2 Digital Skills for Educators — Full Application',
    type: 'past-application',
    source: 'Erasmus+ 2024',
    tags: ['digital skills', 'education', 'KA2', 'partnership'],
    reusePotential: 'high',
    createdAt: '2025-11-14',
    summary: 'Successful application for 3-country partnership on digital competence frameworks for K-12 educators. Score: 88/100.',
    uploadedBy: 'Elena P.',
  },
  {
    id: 'ka-2',
    organizationId: 'org-1',
    title: 'Workforce Transition Impact Report 2024',
    type: 'report',
    source: 'Internal',
    tags: ['workforce', 'impact', 'metrics', 'annual'],
    reusePotential: 'medium',
    createdAt: '2025-03-20',
    summary: 'Annual impact report covering 1,200+ beneficiaries across 4 training programmes. Contains validated KPIs and methodology.',
    uploadedBy: 'Maria K.',
  },
  {
    id: 'ka-3',
    organizationId: 'org-1',
    title: 'Budget Template — Horizon Europe RIA',
    type: 'budget-template',
    source: 'Internal',
    tags: ['budget', 'Horizon Europe', 'RIA', 'template'],
    reusePotential: 'high',
    createdAt: '2025-08-05',
    summary: 'Pre-configured budget template for Horizon Europe RIA actions with personnel cost model and subcontracting limits.',
    uploadedBy: 'Maria K.',
  },
  {
    id: 'ka-4',
    organizationId: 'org-1',
    title: 'Organization Capability Statement',
    type: 'organization-doc',
    source: 'Internal',
    tags: ['capability', 'organization', 'profile'],
    reusePotential: 'high',
    createdAt: '2025-06-12',
    summary: 'Comprehensive capability statement covering organizational expertise, past projects, infrastructure, and partnership network.',
    uploadedBy: 'Elena P.',
  },
  {
    id: 'ka-5',
    organizationId: 'org-1',
    title: 'Green Skills Curriculum Design — Project Description',
    type: 'project-description',
    source: 'ESF+ 2025',
    tags: ['green skills', 'curriculum', 'project design'],
    reusePotential: 'medium',
    createdAt: '2025-09-28',
    summary: 'Detailed project description for green skills curriculum development targeting manufacturing sector workers in transition.',
    uploadedBy: 'Nikos T.',
  },
  {
    id: 'ka-6',
    organizationId: 'org-1',
    title: 'Risk Mitigation Framework — Reusable Section',
    type: 'proposal-fragment',
    source: 'Horizon Europe 2024',
    tags: ['risk', 'mitigation', 'reusable', 'framework'],
    reusePotential: 'high',
    createdAt: '2025-07-18',
    summary: 'Validated risk assessment and mitigation section used in 3 successful applications. Adaptable structure with evidence-based approach.',
    uploadedBy: 'Elena P.',
  },
];

// ── Agent Activity Events ─────────────────────────────────────────

export interface AgentEvent {
  id: string;
  organizationId: string;
  workflowId?: string;
  opportunityId?: string;
  agent: 'Scout' | 'Selection' | 'Writer' | 'Compliance' | 'Coordinator' | 'Copilot';
  eventType: 'discovered' | 'prioritized' | 'drafted' | 'flagged' | 'blocked' | 'overdue' | 'ready' | 'reviewed';
  title: string;
  detail: string;
  timestamp: string;
  severity: Severity;
}

export const agentEvents: AgentEvent[] = [
  { id: 'ae-1', organizationId: 'org-1', opportunityId: 'opp-7', agent: 'Scout', eventType: 'discovered', title: 'New call detected', detail: 'HORIZON-WIDERA-2026-ACCESS-02 added to monitoring queue', timestamp: '2 hours ago', severity: 'info' },
  { id: 'ae-2', organizationId: 'org-1', opportunityId: 'opp-2', agent: 'Selection', eventType: 'prioritized', title: 'Fit assessment complete', detail: 'ERASMUS-EDU-2026-PI-ALL-LOT1 scored 87% fit — recommended for review', timestamp: '3 hours ago', severity: 'info' },
  { id: 'ae-3', organizationId: 'org-1', workflowId: 'wf-1', opportunityId: 'opp-3', agent: 'Compliance', eventType: 'flagged', title: 'Submission risk flagged', detail: 'DIGITAL-2026-SKILLS-04: 2 annexes missing, page limit at 94%', timestamp: '4 hours ago', severity: 'risk' },
  { id: 'ae-4', organizationId: 'org-1', workflowId: 'wf-1', opportunityId: 'opp-3', agent: 'Writer', eventType: 'drafted', title: 'Draft section generated', detail: 'Impact section drafted for DIGITAL-2026-SKILLS-04 using 3 knowledge assets', timestamp: '5 hours ago', severity: 'info' },
  { id: 'ae-5', organizationId: 'org-1', workflowId: 'wf-1', agent: 'Coordinator', eventType: 'overdue', title: 'Deadline reminder sent', detail: 'Partner budget inputs due in 5 days for DIGITAL-2026-SKILLS-04', timestamp: '6 hours ago', severity: 'critical' },
  { id: 'ae-6', organizationId: 'org-1', agent: 'Copilot', eventType: 'reviewed', title: 'Weekly summary generated', detail: 'Pipeline health: 2 active workflows, 1 at risk, 3 opportunities pending review', timestamp: '1 day ago', severity: 'info' },
  { id: 'ae-7', organizationId: 'org-1', agent: 'Scout', eventType: 'discovered', title: 'Source scan complete', detail: 'Scanned 12 funding portals — 3 new relevant calls identified', timestamp: '1 day ago', severity: 'info' },
  { id: 'ae-8', organizationId: 'org-1', agent: 'Selection', eventType: 'flagged', title: 'Capacity constraint detected', detail: 'Current team capacity supports max 2 additional active workflows', timestamp: '1 day ago', severity: 'attention' },
  { id: 'ae-9', organizationId: 'org-1', workflowId: 'wf-2', opportunityId: 'opp-2', agent: 'Writer', eventType: 'ready', title: 'Knowledge asset matched', detail: 'Found 89% content overlap with KA2 Digital Skills application for new Erasmus+ call', timestamp: '2 days ago', severity: 'info' },
  { id: 'ae-10', organizationId: 'org-1', opportunityId: 'opp-1', agent: 'Compliance', eventType: 'reviewed', title: 'Eligibility verified', detail: 'Organization meets all eligibility criteria for HORIZON-CL4-2026-HUMAN-01-03', timestamp: '2 days ago', severity: 'info' },
];

// ── Helpers ───────────────────────────────────────────────────────

export function getOpportunitiesByStage(stage: string): Opportunity[] {
  const stageMap: Record<string, OpportunityStatus[]> = {
    'Identified': ['new'],
    'Watchlist': ['watchlist'],
    'Shortlisted': ['shortlisted'],
    'Active': ['active-workflow'],
    'In Review': [],
    'Ready to Submit': [],
    'Submitted': [],
  };
  return opportunities.filter(o => stageMap[stage]?.includes(o.status));
}
