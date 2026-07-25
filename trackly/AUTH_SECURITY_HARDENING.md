# Trackly Authentication Security Hardening

## Scope

Trackly delegates identity, password hashing, reset-token generation, session issuance, and email verification to **Supabase Auth**. The browser application must not implement password hashing or reset token storage itself.

## Findings and fixes

| Area | Previous client behavior | Risk | Applied fix / required configuration |
|---|---|---|---|
| Sign-up response | Returned raw Supabase errors through `signUp()` | Can expose provider details and support account enumeration | `AuthContext` returns one neutral verification response for all sign-up outcomes. |
| Password-reset response | Returned raw provider error text | Can disclose whether an email is registered | `sendPasswordReset()` always returns one neutral response. |
| Sign-in response | Returned raw Supabase error text | Unhelpful and may expose provider behavior | Client returns a neutral generic response for failed login. |
| Timing | Direct auth calls could visibly vary | Timing can leak limited information | Client enforces a minimum response delay and browser-local retry delay. |
| Repeated attempts | No client throttle | Poor UX and allows rapid repeated browser attempts | `authGuard.ts` adds escalating browser-local delay. |
| Email ownership | Earlier project instructions disabled confirmation | Accounts could become active without verified email ownership | Enable **Confirm email** in Supabase for a secure production release. |
| Password hashing | No custom server code | Risk of accidental insecure custom hashing if added | Use Supabase Auth only. Password hashes are managed by Supabase; do not add client hashing. |
| Reset tokens | No custom token code | Unsafe if custom tokens are stored/logged | Use `resetPasswordForEmail()` only. Supabase owns token generation, hashing, expiry, and single-use semantics. |

## Important limitation: client throttling is not a security boundary

`src/services/authGuard.ts` is a convenience throttle only. A user can clear Local Storage or call Supabase directly. Real rate limits and CAPTCHA must be configured server-side in Supabase.

## Required Supabase production configuration

1. Open **Authentication → Providers → Email**.
2. Keep **Enable email provider** on.
3. Turn **Confirm email** on. New users must verify ownership before an active session is returned.
4. Configure an email sender/SMTP provider for production delivery.
5. Open **Authentication → Settings / Security / Attack Protection** (the exact label varies by Supabase dashboard version).
6. Enable CAPTCHA and configure a supported provider such as Cloudflare Turnstile or hCaptcha. Store the CAPTCHA secret only in Supabase configuration.
7. Configure Supabase Auth rate limits for sign-up, password recovery, OTP/email delivery, and token verification according to expected traffic.
8. Use strong password rules and make the UI minimum length match Supabase’s configured policy.
9. Review **Authentication → Users** and revoke suspicious sessions when needed.

## CAPTCHA integration note

A CAPTCHA must be passed as `captchaToken` in Supabase Auth method options after a CAPTCHA widget is added to `Auth.tsx`. Do not fake CAPTCHA in client code. Use the chosen provider’s official React integration and pass its short-lived token to `signUp`, `signInWithPassword`, and `resetPasswordForEmail` where supported.

## What must not be implemented in Trackly client code

- bcrypt/scrypt/argon2 in the browser
- custom reset token creation
- password storage in Local Storage, Zustand, Supabase public tables, or logs
- email existence checks
- account lookup APIs exposed to unauthenticated visitors
- service-role key in `VITE_*` variables

## Verification checklist

- [ ] Existing and non-existing sign-up email displays the same wording.
- [ ] Existing and non-existing reset email displays the same wording.
- [ ] Failed login displays generic wording.
- [ ] Confirm email is enabled in production.
- [ ] CAPTCHA is enabled in Supabase and token is submitted by client integration.
- [ ] Supabase rate limits are configured.
- [ ] No secret, reset link, access token, refresh token, or database password is committed or logged.
- [ ] `npm run build` passes.
