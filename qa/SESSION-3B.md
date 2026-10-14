# Session 3b — 2026-10-12

Lighthouse 13.5.0, local Python HTTP preview, Chrome headless. Default mobile simulated throttling and desktop preset; single runs, not field data. Full JSON evidence in reports/session-3b-*.json. Earlier temporary installation had been cleared and was restored in /tmp/portfolio-audit-3b.

| Page / mode | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Homepage mobile | 95 | 100 | 100 | 100 |
| Homepage desktop | 100 | 100 | 100 | 100 |
| Onboarding mobile | 93 | 100 | 100 | 100 |
| Onboarding desktop | 100 | 100 | 100 | 100 |

## Fixes and evidence

- Homepage mobile performance improved from 91 to 95; measured LCP 3.5s to 2.9s. Added 800px variants and more accurate responsive image sizes, including lifecycle previews.
- Onboarding mobile performance improved from 90 to 93; LCP remains 3.1s. Added early local-font discovery on the cases and contact page.
- Footer copyright contrast was 2.49:1 in Lighthouse. Explicit shared color fixes the inherited gray; case accessibility rose from 96 to 100. Browser confirmed rgb(83,99,104) after reload.
- Project links now derive their accessible names from their visible content. Theme toggle spoken name matches its visible label. Final mobile label-content-name-mismatch check passes (it is not weighted in the 100 score).
- Added a local SVG browser icon across six pages; missing favicon network error resolved; best-practices rose from 96 to 100.
- Homepage desktop report predates only the final theme-label correction; final mobile run verifies that correction.

## Functional checks

Contact at 390px: no horizontal overflow; empty submission focuses Name and native required validation prevents sending. Labels, email-draft explanation, and fallback email link verified. A completed mailto handoff was source-reviewed, not launched into an email client.

Local onboarding prototype loads and its selector changes to the Welcome stage. Draft and final public Inbox prototypes both load their expected interfaces. No messages, tickets, or real forms were submitted. External prototypes were not exhaustively tested.

Homepage tablet 768px: no document overflow; artwork and layout inspected. Prior sessions cover desktop and phone layouts. Source validator: 6 pages, 110 images, 266 local references, no errors. git diff --check passed.

## Remaining limits

Local server does not provide production caching/compression; cache warnings are not a hosted-site verdict. Mobile LCP is still above 2.5s in these single lab runs. No claim of perfect accessibility: screen-reader testing, reduced-motion/system-dark emulation, and full external-prototype coverage remain unverified. Browser only exposes viewport/visibility capabilities, so preference behavior was reviewed in source rather than changing OS settings. No deployment or push.

Next: bounded Session 4 design critique and highest-impact polish, with these technical limits retained. Award readiness remains unassessed.
