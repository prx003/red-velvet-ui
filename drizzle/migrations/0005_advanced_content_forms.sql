ALTER TABLE public.community_content ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.community_content DROP CONSTRAINT IF EXISTS community_content_kind_check;
ALTER TABLE public.community_content ADD CONSTRAINT community_content_kind_check CHECK (kind IN ('post','reel','tweet','story','news','event','ticket'));
DROP POLICY IF EXISTS content_create ON public.community_content;
CREATE POLICY content_create ON public.community_content FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid()
  AND (kind IN ('post','reel','tweet','story') OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'business'))
  AND (kind <> 'ticket' OR EXISTS (SELECT 1 FROM public.community_content e WHERE e.id = community_content.event_id AND e.user_id = auth.uid() AND e.kind = 'event'))
);