# Agent portal — custom SMTP + branded auth emails (item #2)

Fixes the launch caveat noted in [`agent-portal-setup.md`](agent-portal-setup.md):
Supabase's default auth-email sender is unbranded, rate-limited, and has poor
deliverability. This swaps it for `danang4homes@gmail.com` via Gmail SMTP with
DanangMLS-branded templates.

**Status:** content below is ready to paste in. The four SMTP fields + two
templates are a Supabase **Dashboard** action (Project Settings → Auth), which
needs a logged-in browser session — this machine has no Supabase Management API
token and no browser, so Blake has to click these in, same as the Phase 1 setup
steps. Should take about 3 minutes total.

## Step 1 — SMTP Settings

**Project Settings → Auth → SMTP Settings** (project `coconhgjubqnzxbrgzhx`,
[direct link](https://supabase.com/dashboard/project/coconhgjubqnzxbrgzhx/settings/auth)):

Turn on **Enable Custom SMTP**, then:

| Field | Value |
| --- | --- |
| Sender email | `danang4homes@gmail.com` |
| Sender name | `DanangMLS` |
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `danang4homes@gmail.com` |
| Password | the app password in `~/.openclaw/credentials/google/danang4homes-app-password.json` (`app_password_spaced` field — Gmail app passwords are entered with the spaces) |
| Minimum interval between emails | leave default (60s is fine at this volume) |

Save.

## Step 2 — branded templates

**Authentication → Email Templates.** Only these two matter for the agent portal
(Magic Link / Invite / Change Email aren't used by this flow — leave them
default). Subject line first, then the HTML body to paste into the template
editor. Supabase's `{{ .ConfirmationURL }}` variable is preserved as-is.

Both use the site's actual brand colors (`slate-900` #0f172a wordmark, `blue-600`
#2563eb accent — same as `components/Logo.tsx`) and keep it plain: no external
images (avoids Gmail image-blocking making the email look broken), one button,
one link fallback.

**Both are bilingual, Vietnamese first.** Blake's requirement (2026-08-13): near
enough all Da Nang agents are Vietnamese with very little English, so an
English-only flow is a real barrier to adoption. Supabase sends ONE template per
event — there is no per-recipient language switch — so the language cannot be
chosen at send time. Bilingual in one email is the only option that reaches
everyone, with Vietnamese given visual priority (full size, first) and English
below in muted secondary text.

### Confirm signup

**Subject:** `Xác nhận hồ sơ môi giới DanangMLS · Confirm your DanangMLS agent profile`

```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a;">
  <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;">
    Danang<span style="color:#2563eb;">MLS</span>
  </div>
  <p style="font-size:16px;line-height:1.5;margin:0 0 8px;">
    Xác nhận email của bạn để kích hoạt hồ sơ môi giới trên DanangMLS.
  </p>
  <p style="font-size:14px;line-height:1.5;color:#64748b;margin:0 0 16px;">
    Confirm your email to activate your agent profile on DanangMLS.
  </p>
  <p style="margin:24px 0;">
    <a href="{{ .ConfirmationURL }}"
       style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">
      Xác nhận email · Confirm email
    </a>
  </p>
  <p style="font-size:13px;line-height:1.5;color:#64748b;margin:24px 0 0;">
    Hoặc dán liên kết này vào trình duyệt của bạn / Or paste this link into your browser:<br>
    <a href="{{ .ConfirmationURL }}" style="color:#2563eb;word-break:break-all;">{{ .ConfirmationURL }}</a>
  </p>
  <p style="font-size:13px;line-height:1.5;color:#64748b;margin:24px 0 0;">
    Bạn không yêu cầu email này? Bạn có thể bỏ qua email này.<br>
    <span style="color:#94a3b8;">Didn't request this? You can safely ignore this email.</span>
  </p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px;">
  <p style="font-size:12px;color:#94a3b8;margin:0;">DanangMLS · danangmls.com</p>
</div>
```

### Reset password

**Subject:** `Đặt lại mật khẩu DanangMLS · Reset your DanangMLS password`

```html
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0f172a;">
  <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;">
    Danang<span style="color:#2563eb;">MLS</span>
  </div>
  <p style="font-size:16px;line-height:1.5;margin:0 0 8px;">
    Đặt lại mật khẩu cho tài khoản môi giới DanangMLS của bạn.
  </p>
  <p style="font-size:14px;line-height:1.5;color:#64748b;margin:0 0 16px;">
    Reset the password for your DanangMLS agent account.
  </p>
  <p style="margin:24px 0;">
    <a href="{{ .ConfirmationURL }}"
       style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">
      Đặt lại mật khẩu · Reset password
    </a>
  </p>
  <p style="font-size:13px;line-height:1.5;color:#64748b;margin:24px 0 0;">
    Hoặc dán liên kết này vào trình duyệt của bạn / Or paste this link into your browser:<br>
    <a href="{{ .ConfirmationURL }}" style="color:#2563eb;word-break:break-all;">{{ .ConfirmationURL }}</a>
  </p>
  <p style="font-size:13px;line-height:1.5;color:#64748b;margin:24px 0 0;">
    Bạn không yêu cầu? Bỏ qua email này — mật khẩu của bạn sẽ không thay đổi.<br>
    <span style="color:#94a3b8;">Didn't request this? Ignore this email — your password won't change.</span>
  </p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px;">
  <p style="font-size:12px;color:#94a3b8;margin:0;">DanangMLS · danangmls.com</p>
</div>
```

## Step 3 — verify

After saving, sign up a throwaway test account at
[danangmls.com/account/signup](https://danangmls.com/account/signup) and confirm
the email arrives from "DanangMLS <danang4homes@gmail.com>" with the branded
template, promptly (no more rate-limit delay). Then the internal-team test link
Blake asked for is ready to hand out.
