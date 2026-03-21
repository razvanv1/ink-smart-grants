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
  // ── opp-1: Shortlisted, high fit, top match ─────────────────────
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
    summary: 'Research and innovation action targeting human-centric approaches to AI literacy in workforce transitions. Focus on upskilling frameworks, reusable curricula, and cross-sector pilot validation across 5+ EU countries.',
    whyItFits: 'Direct match: workforce development + digital skills is core expertise. 6 prior successful applications build credibility. Active consortium network across 8 countries covers minimum partner requirements.',
    whyDifficult: 'Minimum 5-country consortium with clear role distribution. Budget justification for AI tooling may face evaluator scrutiny. 8-week preparation window is tight given current workload.',
    eligibility: 'Non-profit, HEI, or research org in EU member state',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-03-10',
  },
  // ── opp-2: Active workflow → wf-2 (Scoping) ────────────────────
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
    status: 'active-workflow',
    recommendedAction: 'Continue Workflow',
    fundingRange: '€250K – €400K',
    thematicArea: 'Partnerships for Innovation',
    fundingType: 'Cooperation Partnership',
    summary: 'Cooperation partnerships for innovation in education and training with emphasis on digital transformation, green skills integration, and learner-centred design across programme countries.',
    whyItFits: 'Strongest programme match. Previous successful KA2 project (2024) provides direct track record. Can reuse 60%+ of narrative from prior application (ka-1). Low effort for high probability.',
    whyDifficult: 'Competitive call , ~800 submissions for 120 funded projects. Need to clearly differentiate approach from prior KA2.',
    eligibility: 'Any organization in programme countries',
    partnerRequired: true,
    complexity: 'medium',
    createdAt: '2026-03-08',
  },
  // ── opp-3: Active workflow → wf-1 (Drafting, at-risk) ──────────
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
    recommendedAction: 'Resolve blockers',
    fundingRange: '€1.5M – €3M',
    thematicArea: 'Advanced Digital Skills',
    fundingType: 'Grant',
    summary: 'Deployment of advanced digital skills training targeting SMEs and public sector in underserved regions. Co-financing required. Focus on scalable delivery infrastructure.',
    whyItFits: 'Established training delivery infrastructure. Strong regional networks for SME engagement. Fits national priority alignment in Greece.',
    whyDifficult: '50% co-financing requirement. Deployment-focused , less room for research. Deadline in 19 days with 2 unresolved blockers.',
    eligibility: 'Legal entities in EU member states',
    partnerRequired: false,
    complexity: 'high',
    createdAt: '2026-02-20',
  },
  // ── opp-4: Watchlist, low urgency ───────────────────────────────
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
    summary: 'National ESF+ call targeting skills development for green and digital transitions in the Greek labor market. Single-applicant format.',
    whyItFits: 'Operating in Greece with relevant training capacity. Can leverage existing curriculum assets from ka-5. Low effort single-applicant call.',
    whyDifficult: 'National procurement rules limit flexibility. Heavy reporting requirements. Greek-language application may delay Grant Writer Agent drafting.',
    eligibility: 'Registered organizations in Greece',
    partnerRequired: false,
    complexity: 'low',
    createdAt: '2026-03-01',
  },
  // ── opp-5: New, needs more info ─────────────────────────────────
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
    summary: 'Projects promoting civic participation and democratic engagement through innovative methods and digital tools. Focus on youth engagement and media literacy.',
    whyItFits: 'Partial alignment through community engagement work. Could expand civic education portfolio. Media literacy angle connects to digital skills expertise.',
    whyDifficult: 'Not core domain , would require new partnerships. No prior CERV track record. Selection Orchestrator flagged capacity constraint.',
    eligibility: 'Non-profit organizations in EU',
    partnerRequired: true,
    complexity: 'medium',
    createdAt: '2026-03-18',
  },
  // ── opp-6: Ignored, poor fit ────────────────────────────────────
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
    whyItFits: 'Minimal overlap. Organization lacks manufacturing infrastructure.',
    whyDifficult: 'Requires industrial partners and massive co-financing. Budget 10x beyond organizational range. Outside domain expertise entirely.',
    eligibility: 'Industrial entities with manufacturing capacity',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-03-05',
  },
  // ── opp-7: New, recently discovered ─────────────────────────────
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
    summary: 'Coordination and support actions to strengthen R&I ecosystems in widening countries through talent mobility and institutional capacity building.',
    whyItFits: 'Located in Greece (widening country). Experience with institutional capacity building through training programmes. CSA format aligns with coordination expertise.',
    whyDifficult: 'CSA requires strong coordination plan with systemic impact evidence. Need to demonstrate institutional transformation pathway, not just training delivery.',
    eligibility: 'Entities in widening countries',
    partnerRequired: true,
    complexity: 'medium',
    createdAt: '2026-03-19',
  },
  // ── opp-8: Rejected, weak alignment ─────────────────────────────
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
    summary: 'Projects addressing environmental governance including circular economy, biodiversity, and compliance monitoring.',
    whyItFits: 'Minimal alignment with organizational focus.',
    whyDifficult: 'Requires environmental domain expertise not in team. No green transition track record beyond green skills curriculum.',
    eligibility: 'Public or private entities in EU',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-02-28',
  },
  // ── opp-9: Active workflow → wf-4 (Review stage) ────────────────
  {
    id: 'opp-9',
    organizationId: 'org-1',
    callName: 'ERASMUS-EDU-2025-PCOOP-SKILLS',
    programme: 'Erasmus+',
    sourceUrl: 'https://erasmus-plus.ec.europa.eu',
    geography: 'EU + Associated Countries',
    fitScore: 91,
    effortScore: 40,
    urgency: 'high',
    deadline: '2026-04-15',
    status: 'active-workflow',
    recommendedAction: 'Finalize review',
    fundingRange: '€200K – €400K',
    thematicArea: 'Digital Education & Green Skills',
    fundingType: 'Cooperation Partnership',
    summary: 'Partnership for digital education integration in VET systems with cross-border piloting of green skills curricula.',
    whyItFits: 'Near-perfect match. Direct reuse of prior KA2 narrative + green skills project description (ka-5). Consortium already confirmed from prior work.',
    whyDifficult: 'Minor: need to update dissemination plan to reflect new partner in Portugal. Otherwise low risk.',
    eligibility: 'Any organization in programme countries',
    partnerRequired: true,
    complexity: 'low',
    createdAt: '2026-01-15',
  },
  // ── opp-10: Active workflow → wf-5 (Ready to Submit) ────────────
  {
    id: 'opp-10',
    organizationId: 'org-1',
    callName: 'NATIONAL-GR-2026-INNOVATION-SKILLS',
    programme: 'Greek Innovation Fund',
    sourceUrl: 'https://gsri.gov.gr',
    geography: 'National (Greece)',
    fitScore: 88,
    effortScore: 32,
    urgency: 'critical',
    deadline: '2026-03-28',
    status: 'active-workflow',
    recommendedAction: 'Submit',
    fundingRange: '€80K – €200K',
    thematicArea: 'Innovation in Workforce Training',
    fundingType: 'National Grant',
    summary: 'National call for innovation in workforce training methodologies, targeting digital transformation of Greek SME training providers.',
    whyItFits: 'Perfect national fit. Single-applicant. Greek language application leverages local team. Budget within comfortable range. Reuses capability statement (ka-4).',
    whyDifficult: 'Deadline in 7 days. All sections drafted and reviewed. Pending final signature from legal representative.',
    eligibility: 'Registered training organizations in Greece',
    partnerRequired: false,
    complexity: 'low',
    createdAt: '2026-01-20',
  },
  // ── opp-11: Active workflow → wf-6 (Submitted) ──────────────────
  {
    id: 'opp-11',
    organizationId: 'org-1',
    callName: 'ESF-GR-2025-UPSKILL-02',
    programme: 'ESF+ (National)',
    sourceUrl: 'https://ec.europa.eu/esf',
    geography: 'National (Greece)',
    fitScore: 82,
    effortScore: 35,
    urgency: 'low',
    deadline: '2026-02-28',
    status: 'active-workflow',
    recommendedAction: 'Awaiting evaluation',
    fundingRange: '€120K – €300K',
    thematicArea: 'Digital Upskilling for Public Sector',
    fundingType: 'National Grant',
    summary: 'Upskilling programme for Greek public sector employees in digital tools and data literacy, co-funded by ESF+.',
    whyItFits: 'Strong fit with digital skills mandate. Prior ESF+ experience. Reused methodology from ka-2 impact report.',
    whyDifficult: 'Already submitted. Awaiting evaluation results expected May 2026.',
    eligibility: 'Accredited training organizations in Greece',
    partnerRequired: false,
    complexity: 'low',
    createdAt: '2025-12-10',
  },
  // ── opp-12: Shortlisted, new ────────────────────────────────────
  {
    id: 'opp-12',
    organizationId: 'org-1',
    callName: 'DIGITAL-2026-DEPLOY-AI-06',
    programme: 'Digital Europe',
    sourceUrl: 'https://digital-strategy.ec.europa.eu',
    geography: 'EU Member States',
    fitScore: 76,
    effortScore: 60,
    urgency: 'medium',
    deadline: '2026-07-01',
    status: 'shortlisted',
    recommendedAction: 'Review',
    fundingRange: '€1M – €2.5M',
    thematicArea: 'AI Testing & Experimentation',
    fundingType: 'Grant',
    summary: 'Deployment of AI testing and experimentation facilities for SMEs, with focus on workforce readiness assessment tools.',
    whyItFits: 'AI literacy expertise + SME network. Could position org as testing facility partner. Builds on workforce readiness assessment methodology.',
    whyDifficult: 'Requires technical infrastructure partner. 50% co-financing. New territory , no prior Digital Europe deployment experience.',
    eligibility: 'Consortia including at least one SME hub',
    partnerRequired: true,
    complexity: 'high',
    createdAt: '2026-03-20',
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
  // wf-1: Drafting, at-risk → opp-3 (DIGITAL-2026-SKILLS-04, deadline Apr 8)
  {
    id: 'wf-1',
    organizationId: 'org-1',
    name: 'Digital Europe Skills Deployment',
    opportunityId: 'opp-3',
    opportunityName: 'DIGITAL-2026-SKILLS-04',
    stage: 'Drafting',
    owner: 'Maria K.',
    deadline: '2026-04-08',
    readinessScore: 52,
    blockers: 2,
    status: 'at-risk',
    nextMilestone: 'Resolve co-financing confirmation + complete budget annex',
    createdAt: '2026-02-25',
    updatedAt: '2026-03-20',
  },
  // wf-2: Scoping → opp-2 (Erasmus+ PI, deadline Jun 22)
  {
    id: 'wf-2',
    organizationId: 'org-1',
    name: 'Erasmus+ Innovation Partnership 2026',
    opportunityId: 'opp-2',
    opportunityName: 'ERASMUS-EDU-2026-PI-ALL-LOT1',
    stage: 'Scoping',
    owner: 'Nikos T.',
    deadline: '2026-06-22',
    readinessScore: 24,
    blockers: 0,
    status: 'active',
    nextMilestone: 'Finalize consortium composition and role distribution',
    createdAt: '2026-03-12',
    updatedAt: '2026-03-19',
  },
  // wf-3: Inputs Pending → opp-1 (Horizon Europe AI Literacy, deadline May 15)
  {
    id: 'wf-3',
    organizationId: 'org-1',
    name: 'Horizon AI Literacy Consortium',
    opportunityId: 'opp-1',
    opportunityName: 'HORIZON-CL4-2026-HUMAN-01-03',
    stage: 'Inputs Pending',
    owner: 'Elena P.',
    deadline: '2026-05-15',
    readinessScore: 41,
    blockers: 3,
    status: 'at-risk',
    nextMilestone: 'Collect partner mandate letters (3 of 5 pending)',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-21',
  },
  // wf-4: Review → opp-9 (Erasmus+ PCOOP Skills, deadline Apr 15)
  {
    id: 'wf-4',
    organizationId: 'org-1',
    name: 'Erasmus+ Digital Education VET',
    opportunityId: 'opp-9',
    opportunityName: 'ERASMUS-EDU-2025-PCOOP-SKILLS',
    stage: 'Review',
    owner: 'Elena P.',
    deadline: '2026-04-15',
    readinessScore: 82,
    blockers: 1,
    status: 'active',
    nextMilestone: 'Update dissemination plan for new Portuguese partner',
    createdAt: '2026-01-20',
    updatedAt: '2026-03-20',
  },
  // wf-5: Ready to Submit → opp-10 (National Greek Innovation, deadline Mar 28)
  {
    id: 'wf-5',
    organizationId: 'org-1',
    name: 'Greek Innovation Skills Grant',
    opportunityId: 'opp-10',
    opportunityName: 'NATIONAL-GR-2026-INNOVATION-SKILLS',
    stage: 'Ready to Submit',
    owner: 'Maria K.',
    deadline: '2026-03-28',
    readinessScore: 94,
    blockers: 0,
    status: 'active',
    nextMilestone: 'Obtain director signature and submit',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-21',
  },
  // wf-6: Submitted → opp-11 (ESF+ Upskilling, deadline Feb 28 , past)
  {
    id: 'wf-6',
    organizationId: 'org-1',
    name: 'ESF+ Public Sector Upskilling',
    opportunityId: 'opp-11',
    opportunityName: 'ESF-GR-2025-UPSKILL-02',
    stage: 'Submitted',
    owner: 'Nikos T.',
    deadline: '2026-02-28',
    readinessScore: 100,
    blockers: 0,
    status: 'completed',
    nextMilestone: 'Awaiting evaluation , results expected May 2026',
    createdAt: '2025-12-15',
    updatedAt: '2026-02-27',
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
  // ── wf-1: Drafting (at-risk) , DIGITAL-2026-SKILLS-04 ──────────
  { id: 't-1', workflowId: 'wf-1', title: 'Confirm co-financing source (50% requirement)', owner: 'Maria K.', dueDate: '2026-03-25', status: 'blocked', dependency: 'Awaiting municipal co-funding letter', createdAt: '2026-03-01' },
  { id: 't-2', workflowId: 'wf-1', title: 'Complete budget annex with personnel cost breakdown', owner: 'Maria K.', dueDate: '2026-03-28', status: 'in-progress', createdAt: '2026-03-08' },
  { id: 't-3', workflowId: 'wf-1', title: 'Finalize impact section using ka-2 methodology', owner: 'Elena P.', dueDate: '2026-03-26', status: 'in-progress', createdAt: '2026-03-10' },
  { id: 't-4', workflowId: 'wf-1', title: 'Draft work package timeline (24-month deployment)', owner: 'Nikos T.', dueDate: '2026-03-30', status: 'todo', createdAt: '2026-03-15' },
  { id: 't-5', workflowId: 'wf-1', title: 'Upload signed legal entity form', owner: 'Maria K.', dueDate: '2026-04-01', status: 'waiting', dependency: 'Legal representative on leave until Mar 27', createdAt: '2026-03-05' },

  // ── wf-2: Scoping , Erasmus+ Innovation Partnership ─────────────
  { id: 't-6', workflowId: 'wf-2', title: 'Map potential consortium partners (min. 3 countries)', owner: 'Nikos T.', dueDate: '2026-04-05', status: 'in-progress', createdAt: '2026-03-12' },
  { id: 't-7', workflowId: 'wf-2', title: 'Draft project objectives differentiating from prior KA2', owner: 'Nikos T.', dueDate: '2026-04-15', status: 'todo', createdAt: '2026-03-12' },
  { id: 't-8', workflowId: 'wf-2', title: 'Review reusable narrative sections from ka-1', owner: 'Elena P.', dueDate: '2026-04-10', status: 'todo', createdAt: '2026-03-14' },

  // ── wf-3: Inputs Pending , Horizon AI Literacy Consortium ───────
  { id: 't-9', workflowId: 'wf-3', title: 'Collect signed mandate letter from TU Berlin', owner: 'Elena P.', dueDate: '2026-04-01', status: 'waiting', dependency: 'Partner requested 10-day review period', createdAt: '2026-03-15' },
  { id: 't-10', workflowId: 'wf-3', title: 'Collect signed mandate letter from Univ. of Ljubljana', owner: 'Elena P.', dueDate: '2026-04-01', status: 'waiting', dependency: 'Sent Mar 18, no response yet', createdAt: '2026-03-15' },
  { id: 't-11', workflowId: 'wf-3', title: 'Collect signed mandate letter from CEDEFOP liaison', owner: 'Elena P.', dueDate: '2026-04-05', status: 'blocked', dependency: 'Contact person changed , new signatory unknown', createdAt: '2026-03-15' },
  { id: 't-12', workflowId: 'wf-3', title: 'Finalize AI literacy curriculum framework outline', owner: 'Nikos T.', dueDate: '2026-04-10', status: 'in-progress', createdAt: '2026-03-18' },
  { id: 't-13', workflowId: 'wf-3', title: 'Add impact KPIs aligned with Cluster 4 indicators', owner: 'Maria K.', dueDate: '2026-04-12', status: 'todo', createdAt: '2026-03-20' },

  // ── wf-4: Review , Erasmus+ Digital Education VET ───────────────
  { id: 't-14', workflowId: 'wf-4', title: 'Update dissemination plan for Portuguese partner', owner: 'Elena P.', dueDate: '2026-04-05', status: 'in-progress', createdAt: '2026-03-18' },
  { id: 't-15', workflowId: 'wf-4', title: 'Final proofread of all narrative sections', owner: 'Nikos T.', dueDate: '2026-04-08', status: 'todo', createdAt: '2026-03-19' },
  { id: 't-16', workflowId: 'wf-4', title: 'Validate budget coherence against work packages', owner: 'Maria K.', dueDate: '2026-04-06', status: 'done', createdAt: '2026-03-15' },

  // ── wf-5: Ready to Submit , Greek Innovation Skills ─────────────
  { id: 't-17', workflowId: 'wf-5', title: 'Obtain director signature on application form', owner: 'Maria K.', dueDate: '2026-03-26', status: 'in-progress', createdAt: '2026-03-20' },
  { id: 't-18', workflowId: 'wf-5', title: 'Upload final PDF to national portal', owner: 'Nikos T.', dueDate: '2026-03-27', status: 'todo', dependency: 'Pending director signature', createdAt: '2026-03-20' },
  { id: 't-19', workflowId: 'wf-5', title: 'Verify all annexes attached and correctly numbered', owner: 'Maria K.', dueDate: '2026-03-25', status: 'done', createdAt: '2026-03-18' },

  // ── wf-6: Submitted , ESF+ Public Sector Upskilling ─────────────
  { id: 't-20', workflowId: 'wf-6', title: 'Submit application via ESF+ portal', owner: 'Nikos T.', dueDate: '2026-02-27', status: 'done', createdAt: '2026-02-20' },
  { id: 't-21', workflowId: 'wf-6', title: 'Archive all supporting documents', owner: 'Maria K.', dueDate: '2026-02-28', status: 'done', createdAt: '2026-02-27' },
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
    title: 'KA2 Digital Skills for Educators , Full Application',
    type: 'past-application',
    source: 'Erasmus+ 2024',
    tags: ['digital skills', 'education', 'KA2', 'partnership', 'Erasmus+'],
    reusePotential: 'high',
    createdAt: '2025-11-14',
    summary: 'Successful application for 3-country partnership on digital competence frameworks for K-12 educators. Score: 88/100. Reused in wf-2 (scoping) and wf-4 (review).',
    uploadedBy: 'Elena P.',
  },
  {
    id: 'ka-2',
    organizationId: 'org-1',
    title: 'Workforce Transition Impact Report 2024',
    type: 'report',
    source: 'Internal',
    tags: ['workforce', 'impact', 'metrics', 'annual', 'KPIs'],
    reusePotential: 'high',
    createdAt: '2025-03-20',
    summary: 'Annual impact report: 1,200+ beneficiaries across 4 programmes. Contains validated KPIs and assessment methodology. Used in wf-1 impact section drafting and wf-6 ESF+ submission.',
    uploadedBy: 'Maria K.',
  },
  {
    id: 'ka-3',
    organizationId: 'org-1',
    title: 'Budget Template , Horizon Europe RIA',
    type: 'budget-template',
    source: 'Internal',
    tags: ['budget', 'Horizon Europe', 'RIA', 'template', 'personnel costs'],
    reusePotential: 'high',
    createdAt: '2025-08-05',
    summary: 'Pre-configured budget template for Horizon Europe RIA with personnel cost model, subcontracting limits, and equipment depreciation. Applied in wf-3 budget preparation.',
    uploadedBy: 'Maria K.',
  },
  {
    id: 'ka-4',
    organizationId: 'org-1',
    title: 'Organization Capability Statement',
    type: 'organization-doc',
    source: 'Internal',
    tags: ['capability', 'organization', 'profile', 'track record'],
    reusePotential: 'high',
    createdAt: '2025-06-12',
    summary: 'Comprehensive capability statement covering expertise, past projects (6 funded), infrastructure, and 14-partner network. Reused across all active workflows as applicant description.',
    uploadedBy: 'Elena P.',
  },
  {
    id: 'ka-5',
    organizationId: 'org-1',
    title: 'Green Skills Curriculum Design , Project Description',
    type: 'project-description',
    source: 'ESF+ 2025',
    tags: ['green skills', 'curriculum', 'project design', 'VET'],
    reusePotential: 'medium',
    createdAt: '2025-09-28',
    summary: 'Project description for green skills curriculum targeting manufacturing workers. Methodology section reused in wf-4 (Erasmus+ VET) and relevant for opp-4 (ESF+ watchlist).',
    uploadedBy: 'Nikos T.',
  },
  {
    id: 'ka-6',
    organizationId: 'org-1',
    title: 'Risk Mitigation Framework , Reusable Section',
    type: 'proposal-fragment',
    source: 'Horizon Europe 2024',
    tags: ['risk', 'mitigation', 'reusable', 'framework', 'evaluation criteria'],
    reusePotential: 'high',
    createdAt: '2025-07-18',
    summary: 'Validated risk assessment section used in 3 successful applications. Evidence-based structure adaptable to any EU-funded project. Applied in wf-1 and wf-3.',
    uploadedBy: 'Elena P.',
  },
  {
    id: 'ka-7',
    organizationId: 'org-1',
    title: 'Dissemination & Exploitation Plan Template',
    type: 'proposal-fragment',
    source: 'Internal',
    tags: ['dissemination', 'exploitation', 'template', 'communication'],
    reusePotential: 'high',
    createdAt: '2025-10-05',
    summary: 'Modular dissemination plan with channel matrix, stakeholder mapping, and open access strategy. Currently being adapted in wf-4 for Portuguese partner addition.',
    uploadedBy: 'Elena P.',
  },
  {
    id: 'ka-8',
    organizationId: 'org-1',
    title: 'ESF+ Public Sector Upskilling , Submitted Application',
    type: 'past-application',
    source: 'ESF+ 2025',
    tags: ['ESF+', 'public sector', 'digital skills', 'Greece', 'submitted'],
    reusePotential: 'medium',
    createdAt: '2026-02-28',
    summary: 'Completed application submitted Feb 2026. Contains tested methodology for public sector digital training. Awaiting evaluation. Useful reference for opp-4.',
    uploadedBy: 'Nikos T.',
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
  // Recent (today / hours ago)
  { id: 'ae-1', organizationId: 'org-1', workflowId: 'wf-5', opportunityId: 'opp-10', agent: 'Compliance', eventType: 'ready', title: 'Submission checklist passed', detail: 'Greek Innovation Skills Grant: all annexes verified, budget coherence confirmed, application form complete. Ready for director signature.', timestamp: '1 hour ago', severity: 'info' },
  { id: 'ae-2', organizationId: 'org-1', workflowId: 'wf-1', opportunityId: 'opp-3', agent: 'Coordinator', eventType: 'overdue', title: 'Co-financing confirmation overdue', detail: 'Municipal co-funding letter for DIGITAL-2026-SKILLS-04 was due Mar 25. Deadline risk increasing , 14 days until submission.', timestamp: '2 hours ago', severity: 'critical' },
  { id: 'ae-3', organizationId: 'org-1', opportunityId: 'opp-12', agent: 'Scout', eventType: 'discovered', title: 'New call: AI Testing & Experimentation', detail: 'DIGITAL-2026-DEPLOY-AI-06 published today. Matches AI literacy + SME network profile. Scored 76% fit. Added to shortlist for review.', timestamp: '3 hours ago', severity: 'info' },
  { id: 'ae-4', organizationId: 'org-1', workflowId: 'wf-3', agent: 'Coordinator', eventType: 'blocked', title: 'Partner contact issue escalated', detail: 'CEDEFOP mandate letter blocked , contact person changed. New signatory identification required before wf-3 can proceed to drafting.', timestamp: '4 hours ago', severity: 'risk' },
  { id: 'ae-5', organizationId: 'org-1', workflowId: 'wf-1', opportunityId: 'opp-3', agent: 'Writer', eventType: 'drafted', title: 'Impact section generated', detail: 'Generated impact narrative for DIGITAL-2026-SKILLS-04 using ka-2 workforce methodology and ka-6 risk framework. 3 knowledge assets referenced.', timestamp: '5 hours ago', severity: 'info' },

  // Yesterday
  { id: 'ae-6', organizationId: 'org-1', workflowId: 'wf-4', opportunityId: 'opp-9', agent: 'Compliance', eventType: 'flagged', title: 'Dissemination plan update needed', detail: 'Erasmus+ VET application: dissemination plan references 4 partners but consortium now has 5. Portuguese partner INOVA+ must be added before compliance review passes.', timestamp: '1 day ago', severity: 'attention' },
  { id: 'ae-7', organizationId: 'org-1', opportunityId: 'opp-7', agent: 'Selection', eventType: 'prioritized', title: 'Fit assessment complete', detail: 'HORIZON-WIDERA-2026-ACCESS-02 scored 73% fit. Widening country location is strong advantage. Recommended for review but flagged capacity constraint , currently 4 active workflows.', timestamp: '1 day ago', severity: 'attention' },
  { id: 'ae-8', organizationId: 'org-1', agent: 'Copilot', eventType: 'reviewed', title: 'Weekly operations summary', detail: 'Pipeline: 6 active workflows (2 at risk). wf-5 ready to submit in 7 days. wf-1 has critical deadline risk. Team capacity at 90% , recommend deferring new workflow starts until after Apr 8.', timestamp: '1 day ago', severity: 'info' },
  { id: 'ae-9', organizationId: 'org-1', agent: 'Scout', eventType: 'discovered', title: 'Source scan complete', detail: 'Scanned 14 funding portals. 2 new relevant calls identified (HORIZON-WIDERA-2026-ACCESS-02, DIGITAL-2026-DEPLOY-AI-06). 4 monitored calls unchanged.', timestamp: '1 day ago', severity: 'info' },
  { id: 'ae-10', organizationId: 'org-1', agent: 'Selection', eventType: 'flagged', title: 'Capacity constraint active', detail: 'Current team capacity supports max 3–4 concurrent workflows. Currently at 4 active + 1 ready to submit. Recommend pausing new workflow creation until wf-5 is submitted and wf-1 resolves blockers.', timestamp: '1 day ago', severity: 'attention' },

  // 2–3 days ago
  { id: 'ae-11', organizationId: 'org-1', workflowId: 'wf-2', opportunityId: 'opp-2', agent: 'Writer', eventType: 'ready', title: 'Knowledge asset matched', detail: 'Found 89% content overlap between ka-1 (KA2 Digital Skills) and Erasmus+ Innovation Partnership scope. Narrative reuse recommended for objectives and methodology sections.', timestamp: '2 days ago', severity: 'info' },
  { id: 'ae-12', organizationId: 'org-1', workflowId: 'wf-3', opportunityId: 'opp-1', agent: 'Compliance', eventType: 'reviewed', title: 'Eligibility verified', detail: 'Organization meets all eligibility criteria for HORIZON-CL4-2026-HUMAN-01-03. Non-profit status confirmed, widening country bonus applicable, min 5-country consortium rule noted.', timestamp: '2 days ago', severity: 'info' },
  { id: 'ae-13', organizationId: 'org-1', workflowId: 'wf-4', agent: 'Writer', eventType: 'drafted', title: 'Full draft structure generated', detail: 'Erasmus+ VET draft complete: 8 sections generated using ka-1, ka-5, and ka-7. 82% readiness score. Only dissemination plan needs partner update.', timestamp: '3 days ago', severity: 'info' },
  { id: 'ae-14', organizationId: 'org-1', workflowId: 'wf-5', agent: 'Compliance', eventType: 'reviewed', title: 'Pre-submission compliance passed', detail: 'Greek Innovation Skills application: all 6 compliance criteria met. Budget within limits. Narrative under page count. No eligibility issues detected.', timestamp: '3 days ago', severity: 'info' },
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

  // For workflow-linked stages, cross-reference workflows
  if (stage === 'In Review') {
    const reviewWfOppIds = workflows.filter(w => w.stage === 'Review' || w.stage === 'Compliance Check').map(w => w.opportunityId);
    return opportunities.filter(o => reviewWfOppIds.includes(o.id));
  }
  if (stage === 'Ready to Submit') {
    const readyWfOppIds = workflows.filter(w => w.stage === 'Ready to Submit').map(w => w.opportunityId);
    return opportunities.filter(o => readyWfOppIds.includes(o.id));
  }
  if (stage === 'Submitted') {
    const submittedWfOppIds = workflows.filter(w => w.stage === 'Submitted').map(w => w.opportunityId);
    return opportunities.filter(o => submittedWfOppIds.includes(o.id));
  }
  if (stage === 'Active') {
    const otherLinkedStages: WorkflowStage[] = ['Review', 'Compliance Check', 'Ready to Submit', 'Submitted'];
    const otherOppIds = workflows.filter(w => otherLinkedStages.includes(w.stage)).map(w => w.opportunityId);
    return opportunities.filter(o => o.status === 'active-workflow' && !otherOppIds.includes(o.id));
  }

  return opportunities.filter(o => stageMap[stage]?.includes(o.status));
}
