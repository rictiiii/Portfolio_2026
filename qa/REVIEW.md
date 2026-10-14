# Portfolio quality review — 2026-10-12

## Assessment

A coherent, polished product-design portfolio with a stronger technical foundation. I would not yet describe it as a convincing Awwwards, Webby, or FWA contender. This is an editorial assessment, not a prediction of jury results. The technical scores do not measure originality or storytelling.

## What now works

Clear introduction and direct access to four projects; a recognizable playful folder motif; consistent typography and neutral/cyan case-study presentation; actual product artifacts; a useful three-stage Merchant Hub demonstration; readable phone layouts; keyboard menus, chapter navigation, and a clear route onward from each case. Contact uses the same visual language and explains the email-draft handoff honestly.

## Remaining quality gaps

1. **Originality and opening impression:** the folder is distinctive, but the surrounding headline and conventional project grid do not yet form a strong, ownable concept. The lifecycle demonstration is useful but appears late in the page. Next pass should connect the opening to the idea of changing product priorities, using existing artifacts rather than decorative effects.
2. **Evidence and narrative:** Koto and Kiosk metrics need dates, cohort/sample sizes, and measurement methods. Preserve current claims; do not fabricate substantiation. Project stories should emphasize the actual decision and tradeoff earlier, supported by original artifacts.
3. **Artifact legibility:** multi-screen compositions become small on phones. A focused, accessible image detail view could let reviewers inspect the work without downloading large originals by default.
4. **Release confidence:** mobile lab LCP remains 2.9s homepage / 3.1s representative case. Real-user performance, screen-reader testing, system-dark/reduced-motion emulation, physical-device and cross-browser media testing remain incomplete. Existing inconsistent access-policy behavior remains unchanged.

## Measured checks

Session 3b Lighthouse 13.5.0 local lab results: homepage mobile 95/100/100/100; onboarding mobile 93/100/100/100; both desktop 100/100/100/100 (performance/accessibility/best practices/SEO). These predate Session 4 contact/continuation styling; homepage content did not change in Session 4. Full settings, caveats and reports: SESSION-3B.md and reports/.

Session 4: refined contact controls and added keyboard skip link; added a shared case-ending navigation to selected work/contact. Contact visually checked at 1280×900 and 320×740; no phone overflow. Skip link focuses main. Case continuation inspected at 320px with visible focus; return link reaches index.html#work. Source validation: 6 pages, 110 image declarations, 275 local references, no errors. Whitespace check passed. Shared continuation markup validated on all four pages; rendered check sampled Onboarding.

## Next bounded work

Session 5: improve homepage opening composition and specificity around the existing folder/merchant-lifecycle idea. One implementation pass plus desktop/mobile, keyboard, reduced-motion source and affected-performance checks. Keep project access immediate. Do not redesign all case studies in the same session.

Session 6 if warranted: focused artifact inspection experience for phone readers. Owner-supplied measurement context and access-policy decisions remain distinct release questions.

All work remains local and uncommitted. Nothing pushed or published. Prior review preserved in REVIEW-2026-10-01.md; it is historical and contains superseded limitations.

## Session 5 update

Opening copy now names concrete workflows; a four-project shortcut index preserves fast access; the lifecycle demonstration appears before the gallery and has a direct hero link. This addresses the narrative connection but does not close the overall originality/award-readiness gap. Current mobile recheck is 94 performance/100 accessibility, LCP 3.1s. Next: artifact detail inspection. See SESSION-5.md.

## Creative redesign update

Opening now uses oversized offset typography and a smaller folder signature; flagship comparison includes the original dashboard and three redesigned states; gallery uses larger alternating presentations. This supersedes the earlier conventional-opening critique in part. See CREATIVE-PASS.md for the final focused audit. Metric provenance, release testing limits, and independent award judgment remain unresolved.
