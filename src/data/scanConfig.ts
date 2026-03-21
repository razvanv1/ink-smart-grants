/**
 * Shared scan configurator options.
 * Aligned with the EU Funding & Tenders Portal real filter taxonomy.
 * Source: https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals
 */

export const orgTypes = [
  "NGO / Non-profit",
  "SME / Startup",
  "Educational institution",
  "Research / University",
  "Public Sector",
  "Large Enterprise",
  "International Organisation",
] as const;

export const domains = [
  "Digital / AI / Tech",
  "Education / Training",
  "Innovation / R&D",
  "Environment / Climate",
  "Health / Social",
  "Culture / Creative",
  "Agriculture / Rural",
  "Energy / Transport",
  "Security / Defence",
  "Space",
] as const;

export const budgetRanges = [
  "Up to €100K",
  "€100K – €500K",
  "€500K – €2M",
  "€2M – €5M",
  "€5M+",
] as const;

/**
 * Real EU F&T Portal grant type taxonomy.
 * These map to the "Type" filter on the portal.
 */
export const grantTypes = [
  "Direct calls for proposals (EU institutions)",
  "EU External Actions",
  "Calls for funding in cascade (issued by funded projects)",
] as const;

/**
 * Real EU F&T Portal call status values.
 */
export const fundingStatuses = [
  "Open",
  "Forthcoming",
  "Closed",
] as const;

/**
 * Geography / eligibility scope.
 */
export const geographies = [
  "EU-wide",
  "National",
  "Widening Countries",
  "Associated Countries",
  "International (non-EU)",
] as const;

/**
 * Major EU funding programmes (2021-2027 period).
 */
export const programmes = [
  "Horizon Europe",
  "Erasmus+",
  "Digital Europe Programme (DIGITAL)",
  "ESF+",
  "CERV (Citizens, Equality, Rights and Values)",
  "Creative Europe",
  "LIFE",
  "Innovation Fund",
  "Interreg",
  "Connecting Europe Facility (CEF)",
  "EU4Health",
  "Single Market Programme (SMP)",
  "InvestEU",
  "European Defence Fund (EDF)",
  "National / Regional Grants",
] as const;
