-- On prep completion the deal task stays in the Incoming/won list and a new
-- delivery task is created in the Projects list. We track that new task id here
-- so the client portal dashboard can read project status/progress and comments.
alter table public.client_onboarding add column if not exists clickup_project_task_id text;
