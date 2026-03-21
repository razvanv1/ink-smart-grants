export interface Opportunity {
  id: string;
  callName: string;
  programme: string;
  geography: string;
  fitScore: number;
  effortScore: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  status: 'new' | 'watchlist' | 'shortlisted' | 'active-workflow' | 'rejected' | 'submitted';
  recommendedAction: string;
  fundingRange: string;
  thematicArea: string;
  fundingType: string;
  summary: string;
  whyItFits: string;
  whyDifficult: string;
  eligibility: string;
  partnerRequired: boolean;
  complexity: 'low' | 'medium' | 'high';
}

export interface Workflow {
  id: string;
  name: string;
  opportunityId: string;
  opportunityName: string;
  stage: string;
  owner: string;
  deadline: string;
  readinessScore: number;
  blockers: number;
  status: 'active' | 'paused' | 'completed' | 'at-risk';
}

export interface KnowledgeAsset {
  id: string;
  title: string;
  type: 'past-application' | 'project-description' | 'report' | 'proposal-fragment' | 'budget-template' | 'organization-doc';
  source: string;
  tags: string[];
  reusePotential: 'high' | 'medium' | 'low';
  dateAdded: string;
  summary: string;
}

export interface AgentEvent {
  id: string;
  agent: string;
  action: string;
  detail: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success' | 'alert';
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'done' | 'overdue';
  workflowId: string;
  dependency?: string;
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    callName: 'HORIZON-CL4-2026-HUMAN-01-03',
    programme: 'Horizon Europe',
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
  },
  {
    id: 'opp-2',
    callName: 'ERASMUS-EDU-2026-PI-ALL-LOT1',
    programme: 'Erasmus+',
    geography: 'EU + Associated Countries',
    fitScore: 87,
    effortScore: 45,
    urgency: 'medium',
    deadline: '2026-06-22',
    status: 'new',
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
  },
  {
    id: 'opp-3',
    callName: 'DIGITAL-2026-SKILLS-04',
    programme: 'Digital Europe',
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
  },
  {
    id: 'opp-4',
    callName: 'ESF-PLUS-2026-SKILLS-TRANSITION',
    programme: 'European Social Fund Plus',
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
  },
  {
    id: 'opp-5',
    callName: 'CERV-2026-CITIZENS-CIV',
    programme: 'CERV',
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
  },
  {
    id: 'opp-6',
    callName: 'INNOVFUND-2026-LSC-01',
    programme: 'Innovation Fund',
    geography: 'EU + EEA',
    fitScore: 42,
    effortScore: 88,
    urgency: 'low',
    deadline: '2026-10-15',
    status: 'rejected',
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
  },
  {
    id: 'opp-7',
    callName: 'HORIZON-WIDERA-2026-ACCESS-02',
    programme: 'Horizon Europe',
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
  },
  {
    id: 'opp-8',
    callName: 'LIFE-2026-SAP-ENV',
    programme: 'LIFE Programme',
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
  },
];

export const workflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'DIGITAL-2026-SKILLS-04 Application',
    opportunityId: 'opp-3',
    opportunityName: 'DIGITAL-2026-SKILLS-04',
    stage: 'Drafting',
    owner: 'Maria K.',
    deadline: '2026-04-08',
    readinessScore: 64,
    blockers: 2,
    status: 'at-risk',
  },
  {
    id: 'wf-2',
    name: 'Erasmus+ KA2 Innovation Partnership',
    opportunityId: 'opp-2',
    opportunityName: 'ERASMUS-EDU-2026-PI-ALL-LOT1',
    stage: 'Scoping',
    owner: 'Nikos T.',
    deadline: '2026-06-22',
    readinessScore: 28,
    blockers: 0,
    status: 'active',
  },
  {
    id: 'wf-3',
    name: 'Horizon Europe AI Literacy Consortium',
    opportunityId: 'opp-1',
    opportunityName: 'HORIZON-CL4-2026-HUMAN-01-03',
    stage: 'Created',
    owner: 'Elena P.',
    deadline: '2026-05-15',
    readinessScore: 12,
    blockers: 1,
    status: 'active',
  },
];

export const knowledgeAssets: KnowledgeAsset[] = [
  {
    id: 'ka-1',
    title: 'KA2 Digital Skills for Educators — Full Application',
    type: 'past-application',
    source: 'Erasmus+ 2024',
    tags: ['digital skills', 'education', 'KA2', 'partnership'],
    reusePotential: 'high',
    dateAdded: '2025-11-14',
    summary: 'Successful application for 3-country partnership on digital competence frameworks for K-12 educators. Score: 88/100.',
  },
  {
    id: 'ka-2',
    title: 'Workforce Transition Impact Report 2024',
    type: 'report',
    source: 'Internal',
    tags: ['workforce', 'impact', 'metrics', 'annual'],
    reusePotential: 'medium',
    dateAdded: '2025-03-20',
    summary: 'Annual impact report covering 1,200+ beneficiaries across 4 training programmes. Contains validated KPIs and methodology.',
  },
  {
    id: 'ka-3',
    title: 'Budget Template — Horizon Europe RIA',
    type: 'budget-template',
    source: 'Internal',
    tags: ['budget', 'Horizon Europe', 'RIA', 'template'],
    reusePotential: 'high',
    dateAdded: '2025-08-05',
    summary: 'Pre-configured budget template for Horizon Europe RIA actions with personnel cost model and subcontracting limits.',
  },
  {
    id: 'ka-4',
    title: 'Organization Capability Statement',
    type: 'organization-doc',
    source: 'Internal',
    tags: ['capability', 'organization', 'profile'],
    reusePotential: 'high',
    dateAdded: '2025-06-12',
    summary: 'Comprehensive capability statement covering organizational expertise, past projects, infrastructure, and partnership network.',
  },
  {
    id: 'ka-5',
    title: 'Green Skills Curriculum Design — Project Description',
    type: 'project-description',
    source: 'ESF+ 2025',
    tags: ['green skills', 'curriculum', 'project design'],
    reusePotential: 'medium',
    dateAdded: '2025-09-28',
    summary: 'Detailed project description for green skills curriculum development targeting manufacturing sector workers in transition.',
  },
  {
    id: 'ka-6',
    title: 'Risk Mitigation Framework — Reusable Section',
    type: 'proposal-fragment',
    source: 'Horizon Europe 2024',
    tags: ['risk', 'mitigation', 'reusable', 'framework'],
    reusePotential: 'high',
    dateAdded: '2025-07-18',
    summary: 'Validated risk assessment and mitigation section used in 3 successful applications. Adaptable structure with evidence-based approach.',
  },
];

export const agentEvents: AgentEvent[] = [
  { id: 'ae-1', agent: 'Scout', action: 'New call detected', detail: 'HORIZON-WIDERA-2026-ACCESS-02 added to monitoring queue', timestamp: '2 hours ago', severity: 'info' },
  { id: 'ae-2', agent: 'Selection', action: 'Fit assessment complete', detail: 'ERASMUS-EDU-2026-PI-ALL-LOT1 scored 87% fit — recommended for review', timestamp: '3 hours ago', severity: 'success' },
  { id: 'ae-3', agent: 'Compliance', action: 'Submission risk flagged', detail: 'DIGITAL-2026-SKILLS-04: 2 annexes missing, page limit at 94%', timestamp: '4 hours ago', severity: 'warning' },
  { id: 'ae-4', agent: 'Writer', action: 'Draft section generated', detail: 'Impact section drafted for DIGITAL-2026-SKILLS-04 using 3 knowledge assets', timestamp: '5 hours ago', severity: 'info' },
  { id: 'ae-5', agent: 'Coordinator', action: 'Deadline reminder sent', detail: 'Partner budget inputs due in 5 days for DIGITAL-2026-SKILLS-04', timestamp: '6 hours ago', severity: 'alert' },
  { id: 'ae-6', agent: 'Copilot', action: 'Weekly summary generated', detail: 'Pipeline health: 2 active workflows, 1 at risk, 3 opportunities pending review', timestamp: '1 day ago', severity: 'info' },
  { id: 'ae-7', agent: 'Scout', action: 'Source scan complete', detail: 'Scanned 12 funding portals — 3 new relevant calls identified', timestamp: '1 day ago', severity: 'info' },
  { id: 'ae-8', agent: 'Selection', action: 'Capacity constraint detected', detail: 'Current team capacity supports max 2 additional active workflows', timestamp: '1 day ago', severity: 'warning' },
  { id: 'ae-9', agent: 'Writer', action: 'Knowledge asset matched', detail: 'Found 89% content overlap with KA2 Digital Skills application for new Erasmus+ call', timestamp: '2 days ago', severity: 'success' },
  { id: 'ae-10', agent: 'Compliance', action: 'Eligibility verified', detail: 'Organization meets all eligibility criteria for HORIZON-CL4-2026-HUMAN-01-03', timestamp: '2 days ago', severity: 'success' },
];

export const tasks: Task[] = [
  { id: 't-1', title: 'Finalize partner budget inputs', owner: 'Maria K.', dueDate: '2026-03-28', status: 'overdue', workflowId: 'wf-1' },
  { id: 't-2', title: 'Upload signed partnership declaration', owner: 'Nikos T.', dueDate: '2026-04-01', status: 'pending', workflowId: 'wf-1' },
  { id: 't-3', title: 'Review impact section draft', owner: 'Elena P.', dueDate: '2026-03-25', status: 'in-progress', workflowId: 'wf-1' },
  { id: 't-4', title: 'Confirm consortium composition', owner: 'Elena P.', dueDate: '2026-04-10', status: 'pending', workflowId: 'wf-3' },
  { id: 't-5', title: 'Draft project objectives', owner: 'Nikos T.', dueDate: '2026-04-15', status: 'pending', workflowId: 'wf-2' },
  { id: 't-6', title: 'Complete budget annex', owner: 'Maria K.', dueDate: '2026-03-30', status: 'in-progress', workflowId: 'wf-1' },
];

export const pipelineStages = [
  'Identified',
  'Watchlist',
  'Shortlisted',
  'Active',
  'In Review',
  'Ready to Submit',
  'Submitted',
] as const;

export function getOpportunitiesByStage(stage: string): Opportunity[] {
  const stageMap: Record<string, Opportunity['status'][]> = {
    'Identified': ['new'],
    'Watchlist': ['watchlist'],
    'Shortlisted': ['shortlisted'],
    'Active': ['active-workflow'],
    'In Review': [],
    'Ready to Submit': [],
    'Submitted': ['submitted'],
  };
  return opportunities.filter(o => stageMap[stage]?.includes(o.status));
}
