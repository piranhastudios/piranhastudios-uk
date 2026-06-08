-- When a client's project is created (prep pack completed → Projects task), we
-- also create a client_contract quest in the guild hub (guild.quests). Track
-- its id here so creation is idempotent. Stored as text (also holds a transient
-- 'pending' claim sentinel to stop concurrent polls creating duplicate quests).
alter table public.client_onboarding add column if not exists guild_quest_id text;
