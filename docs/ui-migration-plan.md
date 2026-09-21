# Nuoitoi UI Migration Plan

## Goal

Make Nuoitoi feel like a sibling product of Company Hub: the same typography,
proportions, surfaces, controls, spacing rhythm, interaction language, and
responsive behavior, while preserving Nuoitoi's playful Tet personality and all
existing behavior.

## Sources Of Truth

1. `../company-hub/src/app/globals.css` for visual tokens and responsive rules.
2. `../company-hub/src/app/page.tsx` and `../company-hub/src/components/*` for
   composition and component patterns.
3. `.agents/skills/ui-ux-pro-max/SKILL.md` and its local search results for UX,
   accessibility, responsive, and carousel guardrails.

The UI Pro Max design-system suggestion is advisory. Company Hub overrides its
palette and typography suggestions because Company Hub is the required product
ecosystem reference.

## Phase 0 - Baseline And Design Audit

### Company Hub language

- 75rem shell with compact mobile gutters and progressively wider layouts.
- Fredoka headings paired with Nunito Sans body copy.
- Warm cream canvas, navy ink, amber highlights, and restrained pastel surfaces.
- Bold outlined illustrations and cards with visible ink borders and offset shadows.
- Large but controlled headings, short readable line lengths, and generous section spacing.
- One clear primary action per region, with bordered secondary actions.
- Repeated section-heading pattern: eyebrow, headline, supporting copy.
- Cards use consistent 2px borders, 24px radius, fixed elevation tokens, and small lifts on hover.
- Navigation is simple and content-first; mobile navigation reflows instead of mimicking a dense desktop bar.
- Breakpoints center on 30rem, 40rem, 48rem, and 60rem, with mobile-first composition.
- Motion is subtle and structural. Decoration does not compete with content.

### Current Nuoitoi gaps

- The checkpoint only maps colors and shadows; the layout still uses the previous landing-page composition.
- Space Grotesk/Plus Jakarta proportions make headings and cards feel unrelated to Company Hub.
- The hero is dominated by an oversized multiline headline and a conventional dashboard card, rather than Company Hub's editorial copy plus playful illustrated object.
- Every section repeats centered headings and same-weight card grids, producing uniform visual density and weak hierarchy.
- Cards retain mixed one-off radii, shadows, gradients, borders, and hardcoded colors.
- Header contains too many equal-weight navigation items and a separate pill language control, unlike Company Hub's quieter shell.
- Donate carousel is visually isolated as a dark promotional island and lacks an explicit autoplay pause control.
- Dialogs and forms still use generic shadcn presentation instead of the ecosystem's outlined, tactile surfaces.
- Continuous petals/fireworks add competing motion and do not match Company Hub's restrained personality.
- Mobile is technically responsive, but the composition is a scaled desktop stack rather than a designed mobile hierarchy.

### Keep, refactor, redesign

| Area | Decision | Reason |
| --- | --- | --- |
| API hooks, data arrays, counters, i18n | Keep | Existing behavior and contracts are in scope to preserve. |
| Section components | Refactor | Keep ownership boundaries, replace repeated layout and card markup with shared primitives. |
| Header/mobile menu/footer | Redesign | Current information density and visual structure do not match Company Hub. |
| Hero | Rebuild | Current composition is the largest visual mismatch. |
| Dashboard/expenses/features | Redesign composition | Use varied editorial/grid patterns rather than identical card walls. |
| Commitments/compare/heart | Merge visual patterns | Preserve all content but reduce repetitive sections and establish hierarchy. |
| Donate carousel | Refactor presentation | Preserve Embla, copy, QR, API states, and dialogs; add accessible autoplay controls. |
| Feedback/detail dialogs | Restyle and restructure | Preserve state and submit behavior while aligning surfaces and actions. |
| Petals/fireworks | Remove from persistent page chrome | Decorative motion conflicts with the shared ecosystem and accessibility guidance. |

## Phase 1 - Foundation / Design System

- Adopt Fredoka Variable and Nunito Sans Variable for the public experience.
- Add semantic public-site tokens based on Company Hub.
- Create reusable `Shell`, `Section`, `SectionHeading`, `Surface`, `ButtonLink`,
  `IconTile`, and status/badge patterns.
- Establish consistent focus, hover, active, disabled, and reduced-motion states.
- Remove the checkpoint override layer once migrated primitives replace it.

Validation: format, focused lint, render smoke.

## Phase 2 - Global Shell

- Rebuild page background, skip link, header, desktop navigation, mobile menu, and footer.
- Keep every anchor, feedback trigger, language switch, and donate link operational.
- Match Company Hub shell width and breakpoint behavior.

Validation: desktop/mobile navigation, keyboard focus, language switch, feedback trigger.

## Phase 3 - Hero / Above The Fold

- Replace the oversized dashboard hero with an editorial two-column composition.
- Build a playful Tet statement-window illustration using code-native surfaces and icons.
- Preserve counters, status text, anchors, and copy.
- Ensure the mobile order prioritizes title, description, CTA, then visual summary.

Validation: counters, anchor CTAs, 320/390/768/1024/1440 composition.

## Phase 4 - Main Content Sections

- Migrate statistics, expenses, features, commitments, comparison, allocation, and heart sections.
- Vary layouts while reusing the same primitives and spacing rhythm.
- Preserve every translation key and detail-dialog trigger.
- Refactor donate carousel shell and states without changing its data behavior.

Validation: all content present, expense dialog, carousel navigation/copy/image dialog,
loading/error/empty states.

## Phase 5 - Dialogs / Interactive Components

- Align feedback and expense/image dialogs with shared surfaces and controls.
- Normalize inputs, labels, errors, buttons, overlays, close targets, and focus states.
- Add explicit pause/resume control to the auto-rotating carousel and stop autoplay on focus/hover.

Validation: keyboard flow, validation errors, pending state, dialog dismissal, autoplay control.

## Phase 6 - Responsive Polish

- Verify 320px, 390-430px, 768px, 1024px, and 1440px.
- Tune content order, line lengths, card columns, navigation density, and section spacing.
- Check horizontal overflow, touch targets, sticky-header offsets, and reduced motion.

Validation: browser screenshots and computed overflow at every target width.

## Phase 7 - Visual Comparison And Cleanup

- Run Company Hub and Nuoitoi together and compare header, hero, card, CTA, section,
  footer, and mobile behavior side by side.
- Remove transitional CSS, unused classes, and obsolete presentation code.
- Run final format, focused lint, tests, type-check/build, and document baseline failures.

## Commit Plan

1. `chore: checkpoint existing company hub style changes`
2. `docs: audit company hub ui migration`
3. `refactor: establish shared nuoitoi design foundations`
4. `refactor: align app shell with company hub`
5. `feat: redesign nuoitoi hero experience`
6. `refactor: migrate main content sections`
7. `refactor: align dialogs and interactive components`
8. `fix: polish responsive layouts`
9. `chore: cleanup ui migration`
