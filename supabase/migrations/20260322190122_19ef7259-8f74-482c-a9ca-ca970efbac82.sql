
-- Enums
CREATE TYPE public.call_lifecycle AS ENUM (
  'discovered', 'saved', 'docs_pending', 'docs_ready',
  'assessment_pending', 'assessed', 'shortlisted', 'rejected',
  'in_preparation', 'awaiting_documents', 'drafting',
  'under_review', 'ready_to_submit', 'submitted', 'archived'
);

CREATE TYPE public.eligibility_status AS ENUM ('eligible', 'not_eligible', 'uncertain', 'needs_manual_review');
CREATE TYPE public.call_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE public.call_judgment AS ENUM ('go', 'watch', 'no_go');
CREATE TYPE public.docs_status AS ENUM ('not_downloaded', 'downloading', 'docs_pending', 'docs_ready');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.action_item_status AS ENUM ('pending', 'done', 'blocked');

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Opportunities (the master call catalog, org-scoped)
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  call_name text NOT NULL,
  programme text NOT NULL DEFAULT '',
  source_url text DEFAULT '',
  geography text DEFAULT '',
  thematic_area text DEFAULT '',
  funding_type text DEFAULT '',
  funding_range text DEFAULT '',
  deadline date,
  eligibility_text text DEFAULT '',
  complexity text DEFAULT 'medium',
  partner_required boolean DEFAULT false,
  summary text DEFAULT '',
  why_it_fits text DEFAULT '',
  why_difficult text DEFAULT '',
  fit_score integer DEFAULT 0,
  effort_score integer DEFAULT 0,
  urgency public.urgency_level DEFAULT 'medium',
  lifecycle public.call_lifecycle DEFAULT 'discovered',
  docs_status public.docs_status DEFAULT 'not_downloaded',
  priority public.call_priority DEFAULT 'medium',
  blockers text[] DEFAULT '{}',
  recommended_action text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view opportunities" ON public.opportunities FOR SELECT TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Members can insert opportunities" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Members can update opportunities" ON public.opportunities FOR UPDATE TO authenticated USING (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "Members can delete opportunities" ON public.opportunities FOR DELETE TO authenticated USING (public.is_org_member(auth.uid(), organization_id));

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Call Documents
CREATE TABLE public.call_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  name text NOT NULL,
  doc_type text NOT NULL DEFAULT 'guide',
  url text,
  downloaded_at timestamptz,
  parsed boolean DEFAULT false,
  pages integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.call_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage call_documents" ON public.call_documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.is_org_member(auth.uid(), o.organization_id)));

-- Call Assessments
CREATE TABLE public.call_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE UNIQUE,
  eligibility public.eligibility_status DEFAULT 'uncertain',
  eligibility_notes text DEFAULT '',
  fit_score integer DEFAULT 0,
  fit_notes text DEFAULT '',
  effort_score integer DEFAULT 0,
  complexity_notes text DEFAULT '',
  risks text[] DEFAULT '{}',
  recommendation text DEFAULT '',
  judgment public.call_judgment DEFAULT 'watch',
  based_on_docs boolean DEFAULT false,
  assessed_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.call_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage call_assessments" ON public.call_assessments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.is_org_member(auth.uid(), o.organization_id)));

CREATE TRIGGER update_call_assessments_updated_at BEFORE UPDATE ON public.call_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Call Action Items
CREATE TABLE public.call_action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  action text NOT NULL,
  owner text,
  due_date date,
  status public.action_item_status DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.call_action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage call_action_items" ON public.call_action_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.is_org_member(auth.uid(), o.organization_id)));

-- Call Notes
CREATE TABLE public.call_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.call_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can manage call_notes" ON public.call_notes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.is_org_member(auth.uid(), o.organization_id)));
