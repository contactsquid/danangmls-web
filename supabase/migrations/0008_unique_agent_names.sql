-- ─────────────────────────────────────────────────────────────────────────────
-- 0008: agent profile names are unique (by name key), and the service role may
-- auto-approve a listing-name claim.
--
-- Blake, 2026-11-25: "I don't want two agents with identical names on the site."
-- Two profiles named "Bích Ngọc🏡" and "bich ngoc" read as one person to a
-- visitor, and the site could not tell which profile a lead belongs to. The app
-- checks first and shows a friendly message (app/account/actions.ts); this index
-- is the backstop for races and for anything that bypasses the app.
--
-- Existing data: NO duplicate keys among the existing profiles (checked
-- 2026-11-26, 38 profiles), so the unique index builds cleanly.
--
-- Idempotent: create or replace / if not exists throughout. Shared Supabase
-- project — one apply covers lotusmls, danangmls, saigonmls and hanoimls.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Name key ────────────────────────────────────────────────────────────────
-- MUST match agentNameKey() in lib/agentNameKey.ts. lib/agentNameKey.test.ts
-- reads THIS file and checks both translate() strings and the example table
-- below against the TypeScript, so edit both sides together.
--
-- Steps: NFC (so a decomposed "ọ" from some keyboards folds like a precomposed
-- one), explicit Vietnamese accent map (no unaccent extension; lowercase AND
-- uppercase forms, so the result does not depend on the database's ctype for
-- lower() of non-ASCII letters), lower(), every run of non [a-z0-9] — emoji,
-- punctuation, spaces, other scripts — becomes one space, trim.
-- An empty result is returned as NULL: the unique index ignores NULLs, so names
-- with no Latin letters (purely Cyrillic or Hangul) are not policed rather than
-- all colliding on ''. The app skips '' the same way.
--
-- Both translate() strings are 134 characters. If they ever drift apart Postgres
-- silently DELETES the surplus characters instead of erroring.
--
-- Shared examples (JSON: [input, key]; "" means NULL here):
--   ["Bích Ngọc🏡","bich ngoc"]
--   ["bich ngoc","bich ngoc"]
--   ["BÍCH  NGỌC","bich ngoc"]
--   ["Đào Lệ Tuyền","dao le tuyen"]
--   ["ĐẶNG THỊ MAI","dang thi mai"]
--   ["Trần Nguyên Lâm","tran nguyen lam"]
--   ["Hoàng Vũ Thái Bình","hoang vu thai binh"]
--   ["🔥 Phạm  Minh Tâm ❤️","pham minh tam"]
--   ["Ms. Vy","ms vy"]
--   ["Mr.Bin_arenda","mr bin arenda"]
--   ["Vy Tran 0905","vy tran 0905"]
--   ["Bích Ngọc Sơn Trà","bich ngoc son tra"]
--   ["àáạảã âầấậẩẫ ăằắặẳẵ èéẹẻẽ êềếệểễ ìíịỉĩ","aaaaa aaaaaa aaaaaa eeeee eeeeee iiiii"]
--   ["òóọỏõ ôồốộổỗ ơờớợởỡ ùúụủũ ưừứựửữ ỳýỵỷỹ đ","ooooo oooooo oooooo uuuuu uuuuuu yyyyy d"]
--   ["ÀÁẠẢÃ ÂẦẤẬẨẪ ĂẰẮẶẲẴ ÈÉẸẺẼ ÊỀẾỆỂỄ ÌÍỊỈĨ","aaaaa aaaaaa aaaaaa eeeee eeeeee iiiii"]
--   ["ÒÓỌỎÕ ÔỒỐỘỔỖ ƠỜỚỢỞỠ ÙÚỤỦŨ ƯỪỨỰỬỮ ỲÝỴỶỸ Đ","ooooo oooooo oooooo uuuuu uuuuuu yyyyy d"]
--   ["Анна",""]
--   ["🏡✨",""]
create or replace function public.agent_name_key(input text)
returns text
language sql
immutable
parallel safe
as $$
  select nullif(btrim(regexp_replace(
    lower(translate(
      normalize(coalesce(input, ''), NFC),
      'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ',
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD'
    )),
    '[^a-z0-9]+', ' ', 'g'
  )), '');
$$;

create unique index if not exists agent_profiles_name_key_unique
  on public.agent_profiles (public.agent_name_key(display_name));

-- ─── Service role may verify a claim ─────────────────────────────────────────
-- The app now auto-approves a listing-name claim when the scraped phone on every
-- listing under that name matches the agent's phone (lib/agentOwnership.ts,
-- shouldAutoApproveClaim). It does that with the SERVICE-ROLE client. Until now
-- this guard reset listing_agent_name_verified for every non-admin caller, and
-- the service role has no auth.uid(), so is_admin() is false for it and the
-- approval was silently dropped. The service role key never reaches a browser,
-- so exempting it does not reopen self-verification: an agent's own session
-- (role "authenticated") is still guarded exactly as before.
-- Otherwise identical to the version in 0001_agent_profiles.sql.
create or replace function public.guard_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin()
     and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    new.id                          := old.id;
    new.slug                        := old.slug;
    new.is_admin                    := old.is_admin;
    new.status                      := old.status;
    new.listing_agent_name_verified := old.listing_agent_name_verified;
    new.created_at                  := old.created_at;
  end if;
  return new;
end;
$$;

-- The app's name check and claim auto-approve read and update agent_profiles with
-- the service role. Auto-expose is OFF on this project, so spell the grant out.
grant select, update on public.agent_profiles to service_role;
