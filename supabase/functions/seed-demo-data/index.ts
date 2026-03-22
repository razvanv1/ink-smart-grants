import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: { user }, error: authErr } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authErr || !user) throw new Error('Unauthorized');

    // Get user's org — auto-create if missing
    let { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      // Auto-create org + membership so seed works without onboarding
      const orgName = user.user_metadata?.full_name
        ? `${user.user_metadata.full_name}'s Organization`
        : 'My Organization';
      const { data: newOrg, error: orgErr } = await supabase
        .from('organizations')
        .insert({ name: orgName, onboarding_complete: false, created_by: user.id })
        .select('id')
        .single();
      if (orgErr) throw orgErr;

      const { error: memErr } = await supabase
        .from('organization_members')
        .insert({ organization_id: newOrg.id, user_id: user.id, role: 'owner' });
      if (memErr) throw memErr;

      membership = { organization_id: newOrg.id };
    }

    const orgId = membership.organization_id;

    // Check if already seeded
    const { count } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId);

    if ((count ?? 0) > 0) {
      return new Response(JSON.stringify({ message: 'Data already exists', count }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Seed opportunities
    const opportunities = [
      {
        organization_id: orgId,
        call_name: 'HORIZON-CL4-2026-HUMAN-01-03',
        programme: 'Horizon Europe',
        source_url: 'https://ec.europa.eu/funding-tenders',
        geography: 'EU-wide',
        thematic_area: 'Digital Skills & AI Literacy',
        funding_type: 'RIA',
        funding_range: '€2M – €4M',
        deadline: '2026-05-15',
        eligibility_text: 'Non-profit, HEI, or research org in EU member state',
        complexity: 'high',
        partner_required: true,
        summary: 'Research and innovation action targeting human-centric approaches to AI literacy in workforce transitions.',
        why_it_fits: 'Direct match: workforce development + digital skills is core expertise. 6 prior successful applications.',
        why_difficult: 'Minimum 5-country consortium. Budget justification for AI tooling may face scrutiny.',
        fit_score: 92,
        effort_score: 68,
        urgency: 'high',
        lifecycle: 'shortlisted',
        docs_status: 'docs_ready',
        priority: 'high',
        blockers: [],
        recommended_action: 'Start Workflow',
      },
      {
        organization_id: orgId,
        call_name: 'ERASMUS-EDU-2026-PI-ALL-LOT1',
        programme: 'Erasmus+',
        source_url: 'https://erasmus-plus.ec.europa.eu',
        geography: 'EU + Associated Countries',
        thematic_area: 'Partnerships for Innovation',
        funding_type: 'Cooperation Partnership',
        funding_range: '€250K – €400K',
        deadline: '2026-06-22',
        eligibility_text: 'Any organization in programme countries',
        complexity: 'medium',
        partner_required: true,
        summary: 'Cooperation partnerships for innovation in education and training with emphasis on digital transformation.',
        why_it_fits: 'Strongest programme match. Previous successful KA2 project provides direct track record.',
        why_difficult: 'Competitive call, ~800 submissions for 120 funded projects.',
        fit_score: 87,
        effort_score: 45,
        urgency: 'medium',
        lifecycle: 'in_preparation',
        docs_status: 'docs_ready',
        priority: 'high',
        blockers: [],
        recommended_action: 'Continue Workflow',
      },
      {
        organization_id: orgId,
        call_name: 'DIGITAL-2026-SKILLS-04',
        programme: 'Digital Europe',
        source_url: 'https://digital-strategy.ec.europa.eu',
        geography: 'EU Member States',
        thematic_area: 'Advanced Digital Skills',
        funding_type: 'Grant',
        funding_range: '€1.5M – €3M',
        deadline: '2026-04-08',
        eligibility_text: 'Legal entities in EU member states',
        complexity: 'high',
        partner_required: false,
        summary: 'Deployment of advanced digital skills training targeting SMEs and public sector.',
        why_it_fits: 'Established training delivery infrastructure. Strong regional networks.',
        why_difficult: '50% co-financing requirement. Deadline in 19 days with 2 unresolved blockers.',
        fit_score: 78,
        effort_score: 72,
        urgency: 'critical',
        lifecycle: 'drafting',
        docs_status: 'docs_ready',
        priority: 'high',
        blockers: ['Municipal co-funding letter not received', 'Legal representative on leave until Mar 27'],
        recommended_action: 'Resolve blockers',
      },
      {
        organization_id: orgId,
        call_name: 'ESF-PLUS-2026-SKILLS-TRANSITION',
        programme: 'European Social Fund Plus',
        source_url: 'https://ec.europa.eu/esf',
        geography: 'National (Greece)',
        thematic_area: 'Skills for Green & Digital Transition',
        funding_type: 'National Grant',
        funding_range: '€150K – €500K',
        deadline: '2026-09-30',
        eligibility_text: 'Registered organizations in Greece',
        complexity: 'low',
        partner_required: false,
        summary: 'National ESF+ call targeting skills development for green and digital transitions.',
        why_it_fits: 'Operating in Greece with relevant training capacity.',
        why_difficult: 'National procurement rules. Greek-language application.',
        fit_score: 84,
        effort_score: 38,
        urgency: 'low',
        lifecycle: 'saved',
        docs_status: 'docs_pending',
        priority: 'low',
        blockers: ['Official documents not yet downloaded'],
        recommended_action: 'Watch',
      },
      {
        organization_id: orgId,
        call_name: 'CERV-2026-CITIZENS-CIV',
        programme: 'CERV',
        source_url: 'https://ec.europa.eu/cerv',
        geography: 'EU-wide',
        thematic_area: 'Citizens Engagement & Civic Participation',
        funding_type: 'Action Grant',
        funding_range: '€75K – €200K',
        deadline: '2026-07-18',
        eligibility_text: 'Non-profit organizations in EU',
        complexity: 'medium',
        partner_required: true,
        summary: 'Projects promoting civic participation through innovative methods and digital tools.',
        why_it_fits: 'Partial alignment through community engagement work.',
        why_difficult: 'Not core domain. No prior CERV track record.',
        fit_score: 61,
        effort_score: 55,
        urgency: 'medium',
        lifecycle: 'discovered',
        docs_status: 'not_downloaded',
        priority: 'medium',
        blockers: [],
        recommended_action: 'Needs More Info',
      },
      {
        organization_id: orgId,
        call_name: 'INNOVFUND-2026-LSC-01',
        programme: 'Innovation Fund',
        source_url: 'https://ec.europa.eu/clima/innovation-fund',
        geography: 'EU + EEA',
        thematic_area: 'Clean Tech Manufacturing',
        funding_type: 'Large-Scale Project',
        funding_range: '€7.5M – €30M',
        deadline: '2026-10-15',
        eligibility_text: 'Industrial entities with manufacturing capacity',
        complexity: 'high',
        partner_required: true,
        summary: 'Large-scale demonstration of innovative clean technologies in manufacturing.',
        why_it_fits: 'Minimal overlap.',
        why_difficult: 'Requires industrial partners. Budget 10x beyond range.',
        fit_score: 42,
        effort_score: 88,
        urgency: 'low',
        lifecycle: 'rejected',
        docs_status: 'not_downloaded',
        priority: 'low',
        blockers: [],
        recommended_action: 'Ignore',
      },
      {
        organization_id: orgId,
        call_name: 'HORIZON-WIDERA-2026-ACCESS-02',
        programme: 'Horizon Europe',
        source_url: 'https://ec.europa.eu/funding-tenders',
        geography: 'Widening Countries',
        thematic_area: 'ERA Talent & Capacity Building',
        funding_type: 'CSA',
        funding_range: '€800K – €1.5M',
        deadline: '2026-06-10',
        eligibility_text: 'Entities in widening countries',
        complexity: 'medium',
        partner_required: true,
        summary: 'Coordination actions to strengthen R&I ecosystems in widening countries.',
        why_it_fits: 'Located in Greece (widening country). CSA format aligns with coordination expertise.',
        why_difficult: 'Need to demonstrate institutional transformation pathway.',
        fit_score: 73,
        effort_score: 52,
        urgency: 'medium',
        lifecycle: 'discovered',
        docs_status: 'not_downloaded',
        priority: 'medium',
        blockers: [],
        recommended_action: 'Review',
      },
      {
        organization_id: orgId,
        call_name: 'ERASMUS-EDU-2025-PCOOP-SKILLS',
        programme: 'Erasmus+',
        source_url: 'https://erasmus-plus.ec.europa.eu',
        geography: 'EU + Associated Countries',
        thematic_area: 'Digital Education & Green Skills',
        funding_type: 'Cooperation Partnership',
        funding_range: '€200K – €400K',
        deadline: '2026-04-15',
        eligibility_text: 'Any organization in programme countries',
        complexity: 'low',
        partner_required: true,
        summary: 'Partnership for digital education integration in VET systems with cross-border piloting.',
        why_it_fits: 'Near-perfect match. Direct reuse of prior KA2 narrative. Consortium already confirmed.',
        why_difficult: 'Minor: need to update dissemination plan.',
        fit_score: 91,
        effort_score: 40,
        urgency: 'high',
        lifecycle: 'under_review',
        docs_status: 'docs_ready',
        priority: 'high',
        blockers: [],
        recommended_action: 'Finalize review',
      },
      {
        organization_id: orgId,
        call_name: 'NATIONAL-GR-2026-INNOVATION-SKILLS',
        programme: 'Greek Innovation Fund',
        source_url: 'https://gsri.gov.gr',
        geography: 'National (Greece)',
        thematic_area: 'Innovation in Workforce Training',
        funding_type: 'National Grant',
        funding_range: '€80K – €200K',
        deadline: '2026-03-28',
        eligibility_text: 'Registered training organizations in Greece',
        complexity: 'low',
        partner_required: false,
        summary: 'National call for innovation in workforce training methodologies.',
        why_it_fits: 'Perfect national fit. Single-applicant. Budget within range.',
        why_difficult: 'Deadline in 7 days. Pending final signature.',
        fit_score: 88,
        effort_score: 32,
        urgency: 'critical',
        lifecycle: 'ready_to_submit',
        docs_status: 'docs_ready',
        priority: 'high',
        blockers: ['Director signature pending'],
        recommended_action: 'Submit',
      },
      {
        organization_id: orgId,
        call_name: 'ESF-GR-2025-UPSKILL-02',
        programme: 'ESF+ (National)',
        source_url: 'https://ec.europa.eu/esf',
        geography: 'National (Greece)',
        thematic_area: 'Digital Upskilling for Public Sector',
        funding_type: 'National Grant',
        funding_range: '€120K – €300K',
        deadline: '2026-02-28',
        eligibility_text: 'Accredited training organizations in Greece',
        complexity: 'low',
        partner_required: false,
        summary: 'Upskilling programme for Greek public sector employees in digital tools.',
        why_it_fits: 'Strong fit with digital skills mandate. Prior ESF+ experience.',
        why_difficult: 'Already submitted. Awaiting evaluation.',
        fit_score: 82,
        effort_score: 35,
        urgency: 'low',
        lifecycle: 'submitted',
        docs_status: 'docs_ready',
        priority: 'medium',
        blockers: [],
        recommended_action: 'Awaiting evaluation',
      },
      {
        organization_id: orgId,
        call_name: 'DIGITAL-2026-DEPLOY-AI-06',
        programme: 'Digital Europe',
        source_url: 'https://digital-strategy.ec.europa.eu',
        geography: 'EU Member States',
        thematic_area: 'AI Testing & Experimentation',
        funding_type: 'Grant',
        funding_range: '€1M – €2.5M',
        deadline: '2026-07-01',
        eligibility_text: 'Consortia including at least one SME hub',
        complexity: 'high',
        partner_required: true,
        summary: 'Deployment of AI testing and experimentation facilities for SMEs.',
        why_it_fits: 'AI literacy expertise + SME network.',
        why_difficult: 'Requires technical infrastructure partner. 50% co-financing.',
        fit_score: 76,
        effort_score: 60,
        urgency: 'medium',
        lifecycle: 'docs_pending',
        docs_status: 'docs_pending',
        priority: 'medium',
        blockers: ['Official documents not fully parsed'],
        recommended_action: 'Review',
      },
    ];

    const { data: insertedOpps, error: oppErr } = await supabase
      .from('opportunities')
      .insert(opportunities)
      .select('id, call_name');

    if (oppErr) throw oppErr;

    const oppMap = new Map(insertedOpps.map((o: any) => [o.call_name, o.id]));

    // Seed assessments for opportunities that have them
    const assessments = [
      {
        opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'),
        eligibility: 'eligible',
        eligibility_notes: 'Organization type (non-profit) and location (Greece, EU member state) match requirements.',
        fit_score: 92,
        fit_notes: 'Direct thematic match with core expertise in workforce development and digital skills.',
        effort_score: 68,
        complexity_notes: '5-country consortium, high budget justification, 8-week prep window.',
        risks: ['Tight preparation window', 'AI tooling budget scrutiny', 'Need 5-country consortium'],
        recommendation: 'Go now. Strong fit, manageable complexity, deadline acceptable.',
        judgment: 'go',
        based_on_docs: true,
      },
      {
        opportunity_id: oppMap.get('ERASMUS-EDU-2026-PI-ALL-LOT1'),
        eligibility: 'eligible',
        eligibility_notes: 'Organization eligible as any entity in programme countries.',
        fit_score: 87,
        fit_notes: 'Strongest programme match. Previous KA2 provides direct track record.',
        effort_score: 45,
        complexity_notes: 'Medium complexity. Can reuse 60% of prior narrative.',
        risks: ['Highly competitive (~800 for 120 slots)', 'Must differentiate from prior KA2'],
        recommendation: 'Go now. High probability of success given track record and low effort.',
        judgment: 'go',
        based_on_docs: true,
      },
      {
        opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'),
        eligibility: 'eligible',
        eligibility_notes: 'Legal entity in EU member state. Meets requirements.',
        fit_score: 78,
        fit_notes: 'Good fit with training infrastructure. Regional SME networks are strong.',
        effort_score: 72,
        complexity_notes: 'High effort. 50% co-financing, deployment focus, tight deadline.',
        risks: ['Co-financing source unconfirmed', 'Deadline in 19 days', '2 unresolved blockers'],
        recommendation: 'Go with caution. Strong fit but co-financing and deadline are critical risks.',
        judgment: 'go',
        based_on_docs: true,
      },
      {
        opportunity_id: oppMap.get('ESF-PLUS-2026-SKILLS-TRANSITION'),
        eligibility: 'uncertain',
        eligibility_notes: 'Likely eligible but official guide not yet parsed.',
        fit_score: 84,
        fit_notes: 'Good thematic fit. Low effort single-applicant call.',
        effort_score: 38,
        complexity_notes: 'Low complexity. Single applicant, national scope.',
        risks: ['National procurement rules', 'Greek-language requirement', 'Assessment based on summary only'],
        recommendation: 'Watch. Good fit but assessment uncertain — official documents not yet downloaded.',
        judgment: 'watch',
        based_on_docs: false,
      },
      {
        opportunity_id: oppMap.get('INNOVFUND-2026-LSC-01'),
        eligibility: 'not_eligible',
        eligibility_notes: 'Requires manufacturing capacity. Organization is non-profit focused on training.',
        fit_score: 42,
        fit_notes: 'No meaningful overlap with organizational expertise.',
        effort_score: 88,
        complexity_notes: 'Massive budget, industrial partners needed.',
        risks: ['Not eligible', 'Outside domain', 'Budget far beyond range'],
        recommendation: 'No-go. Applicant type does not meet eligibility criteria.',
        judgment: 'no_go',
        based_on_docs: false,
      },
      {
        opportunity_id: oppMap.get('ERASMUS-EDU-2025-PCOOP-SKILLS'),
        eligibility: 'eligible',
        eligibility_notes: 'Fully eligible. Prior successful Erasmus+ track record.',
        fit_score: 91,
        fit_notes: 'Near-perfect match. Reuses prior KA2 and green skills project.',
        effort_score: 40,
        complexity_notes: 'Low. Consortium confirmed, narrative largely reusable.',
        risks: ['Dissemination plan needs minor update for new Portuguese partner'],
        recommendation: 'Go now. Near-perfect match, low effort, high probability.',
        judgment: 'go',
        based_on_docs: true,
      },
      {
        opportunity_id: oppMap.get('NATIONAL-GR-2026-INNOVATION-SKILLS'),
        eligibility: 'eligible',
        eligibility_notes: 'Fully eligible. Registered training organization in Greece.',
        fit_score: 88,
        fit_notes: 'Perfect national fit. Single-applicant, comfortable budget range.',
        effort_score: 32,
        complexity_notes: 'Low. All sections complete. Pending signature only.',
        risks: ['Deadline in 7 days', 'Pending director signature'],
        recommendation: 'Submit now. All sections complete, reviewed, and ready.',
        judgment: 'go',
        based_on_docs: true,
      },
      {
        opportunity_id: oppMap.get('ESF-GR-2025-UPSKILL-02'),
        eligibility: 'eligible',
        eligibility_notes: 'Accredited training organization. Fully eligible.',
        fit_score: 82,
        fit_notes: 'Strong fit. Prior ESF+ experience provides track record.',
        effort_score: 35,
        complexity_notes: 'Low. Application submitted successfully.',
        risks: [],
        recommendation: 'Submitted. Awaiting evaluation results expected May 2026.',
        judgment: 'go',
        based_on_docs: true,
      },
      {
        opportunity_id: oppMap.get('DIGITAL-2026-DEPLOY-AI-06'),
        eligibility: 'uncertain',
        eligibility_notes: 'Requires SME hub in consortium. Eligibility depends on partner identification.',
        fit_score: 76,
        fit_notes: 'Good alignment with AI literacy and SME network expertise.',
        effort_score: 60,
        complexity_notes: 'High. Infrastructure partner needed, 50% co-financing.',
        risks: ['No prior Digital Europe deployment experience', 'Infrastructure partner needed'],
        recommendation: 'Watch. Strategic fit is good, but consortium readiness is weak.',
        judgment: 'watch',
        based_on_docs: false,
      },
    ].filter(a => a.opportunity_id);

    if (assessments.length > 0) {
      const { error: assErr } = await supabase.from('call_assessments').insert(assessments);
      if (assErr) throw assErr;
    }

    // Seed documents
    const docs = [
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), name: 'Call document & conditions', doc_type: 'guide', downloaded_at: '2026-03-11T00:00:00Z', parsed: true, pages: 28 },
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), name: 'Evaluation criteria', doc_type: 'evaluation_criteria', downloaded_at: '2026-03-11T00:00:00Z', parsed: true, pages: 6 },
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), name: 'Proposal template Part B', doc_type: 'template', downloaded_at: '2026-03-11T00:00:00Z', parsed: true, pages: 45 },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2026-PI-ALL-LOT1'), name: 'Programme guide 2026', doc_type: 'guide', downloaded_at: '2026-03-09T00:00:00Z', parsed: true, pages: 120 },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2026-PI-ALL-LOT1'), name: 'Application form template', doc_type: 'template', downloaded_at: '2026-03-09T00:00:00Z', parsed: true, pages: 32 },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), name: 'Call document', doc_type: 'guide', downloaded_at: '2026-02-21T00:00:00Z', parsed: true, pages: 18 },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), name: 'Budget template', doc_type: 'template', downloaded_at: '2026-02-21T00:00:00Z', parsed: true, pages: 8 },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), name: 'FAQ v2', doc_type: 'faq', downloaded_at: '2026-03-10T00:00:00Z', parsed: true, pages: 4 },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2025-PCOOP-SKILLS'), name: 'Programme guide 2025', doc_type: 'guide', downloaded_at: '2026-01-16T00:00:00Z', parsed: true, pages: 115 },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2025-PCOOP-SKILLS'), name: 'Application form', doc_type: 'template', downloaded_at: '2026-01-16T00:00:00Z', parsed: true, pages: 28 },
      { opportunity_id: oppMap.get('NATIONAL-GR-2026-INNOVATION-SKILLS'), name: 'Call for proposals (GR)', doc_type: 'guide', downloaded_at: '2026-01-21T00:00:00Z', parsed: true, pages: 22 },
      { opportunity_id: oppMap.get('NATIONAL-GR-2026-INNOVATION-SKILLS'), name: 'Application form', doc_type: 'template', downloaded_at: '2026-01-21T00:00:00Z', parsed: true, pages: 16 },
      { opportunity_id: oppMap.get('ESF-GR-2025-UPSKILL-02'), name: 'Call document (GR)', doc_type: 'guide', downloaded_at: '2025-12-11T00:00:00Z', parsed: true, pages: 20 },
      { opportunity_id: oppMap.get('DIGITAL-2026-DEPLOY-AI-06'), name: 'Call document (draft)', doc_type: 'guide', parsed: false },
    ].filter(d => d.opportunity_id);

    if (docs.length > 0) {
      const { error: docErr } = await supabase.from('call_documents').insert(docs);
      if (docErr) throw docErr;
    }

    // Seed action items
    const actions = [
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), action: 'Identify consortium partners (min 5 countries)', status: 'pending', owner: 'Elena P.', due_date: '2026-03-30' },
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), action: 'Draft project objectives and methodology', status: 'pending', owner: 'Nikos T.', due_date: '2026-04-10' },
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), action: 'Prepare budget framework', status: 'pending', owner: 'Maria K.', due_date: '2026-04-15' },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2026-PI-ALL-LOT1'), action: 'Finalize consortium composition', status: 'pending', owner: 'Nikos T.', due_date: '2026-04-05' },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2026-PI-ALL-LOT1'), action: 'Draft project objectives', status: 'pending', owner: 'Nikos T.', due_date: '2026-04-15' },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), action: 'Confirm co-financing source', status: 'blocked', owner: 'Maria K.', due_date: '2026-03-25' },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), action: 'Complete budget annex', status: 'pending', owner: 'Maria K.', due_date: '2026-03-28' },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), action: 'Finalize impact section', status: 'pending', owner: 'Elena P.', due_date: '2026-03-26' },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), action: 'Upload signed legal entity form', status: 'blocked', owner: 'Maria K.', due_date: '2026-04-01' },
      { opportunity_id: oppMap.get('ESF-PLUS-2026-SKILLS-TRANSITION'), action: 'Download official call documents', status: 'pending' },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2025-PCOOP-SKILLS'), action: 'Update dissemination plan for Portuguese partner', status: 'pending', owner: 'Elena P.', due_date: '2026-04-05' },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2025-PCOOP-SKILLS'), action: 'Final proofread of all sections', status: 'pending', owner: 'Nikos T.', due_date: '2026-04-08' },
      { opportunity_id: oppMap.get('NATIONAL-GR-2026-INNOVATION-SKILLS'), action: 'Obtain director signature', status: 'pending', owner: 'Maria K.', due_date: '2026-03-26' },
      { opportunity_id: oppMap.get('NATIONAL-GR-2026-INNOVATION-SKILLS'), action: 'Upload final PDF to national portal', status: 'pending', owner: 'Nikos T.', due_date: '2026-03-27' },
      { opportunity_id: oppMap.get('ESF-GR-2025-UPSKILL-02'), action: 'Monitor evaluation results', status: 'pending', due_date: '2026-05-15' },
      { opportunity_id: oppMap.get('DIGITAL-2026-DEPLOY-AI-06'), action: 'Download and parse official guide', status: 'pending' },
      { opportunity_id: oppMap.get('DIGITAL-2026-DEPLOY-AI-06'), action: 'Identify potential infrastructure partner', status: 'pending' },
    ].filter(a => a.opportunity_id);

    if (actions.length > 0) {
      const { error: actErr } = await supabase.from('call_action_items').insert(actions);
      if (actErr) throw actErr;
    }

    // Seed notes
    const notes = [
      { opportunity_id: oppMap.get('HORIZON-CL4-2026-HUMAN-01-03'), user_id: user.id, content: 'Top priority for Q2. Aligns with strategic goal of AI literacy leadership.' },
      { opportunity_id: oppMap.get('ERASMUS-EDU-2026-PI-ALL-LOT1'), user_id: user.id, content: 'Reuse narrative from KA2 2024 application. Strong fit.' },
      { opportunity_id: oppMap.get('DIGITAL-2026-SKILLS-04'), user_id: user.id, content: 'Co-financing letter overdue. Legal rep on leave until Mar 27.' },
      { opportunity_id: oppMap.get('ESF-PLUS-2026-SKILLS-TRANSITION'), user_id: user.id, content: 'Monitoring. Will reassess after official documents are available.' },
      { opportunity_id: oppMap.get('NATIONAL-GR-2026-INNOVATION-SKILLS'), user_id: user.id, content: 'All complete. Awaiting signature.' },
      { opportunity_id: oppMap.get('ESF-GR-2025-UPSKILL-02'), user_id: user.id, content: 'Submitted Feb 27. Evaluation expected May 2026.' },
      { opportunity_id: oppMap.get('DIGITAL-2026-DEPLOY-AI-06'), user_id: user.id, content: 'Newly shortlisted. Docs not yet parsed.' },
    ].filter(n => n.opportunity_id);

    if (notes.length > 0) {
      const { error: noteErr } = await supabase.from('call_notes').insert(notes);
      if (noteErr) throw noteErr;
    }

    return new Response(JSON.stringify({
      success: true,
      seeded: {
        opportunities: insertedOpps.length,
        assessments: assessments.length,
        documents: docs.length,
        action_items: actions.length,
        notes: notes.length,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
