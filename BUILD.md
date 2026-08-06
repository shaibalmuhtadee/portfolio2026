# Shaibal Muhtadee portfolio build document

- Status: Phases 4 and 5 implemented; required release-gate rerun is blocked by the local sandbox
- Last updated: August 6, 2026
- Deployment: intentionally deferred

## 1. Outcome

Build a fast, responsive developer portfolio that helps a recruiter answer four questions within a minute:

1. What kind of software engineer is Shaibal?
2. Has he shipped credible work in a professional setting?
3. Can he explain technical decisions and outcomes clearly?
4. How can I review his code, resume, or contact him?

The site should present Shaibal as an early-career software engineer with meaningful production experience, not as a student and not as a senior engineer. His strongest evidence is a 16-month software engineering internship at Zebra Technologies, followed by technically substantial projects across AI, backend systems, infrastructure, and C++.

The primary conversion is a recruiter opening the resume or LinkedIn profile. The secondary conversion is a hiring manager reading enough verified project detail to discuss the work in an interview.

### Success criteria

- A recruiter can find role, location, availability, GitHub, LinkedIn, and contact information without scrolling at 1280 by 720 and 1366 by 768 CSS pixels. Add the resume to this set only after a sanitized public export exists.
- Work evidence appears before biography or a long skills list.
- Every claim comes from the resume or a user-supplied artifact. The site invents no metrics, scope, testimonials, employers, or responsibilities.
- Adding a job or project requires adding one content file, not editing layout code.
- The production site passes Google's Core Web Vitals at the 75th percentile on mobile and desktop once field data is available.
- The site meets WCAG 2.2 AA and works at 320 CSS pixels without horizontal scrolling.

### Out of scope for this build

- Hosting and deployment provider selection
- A CMS, database, or account system
- A blog without at least two strong finished posts
- A contact form, chatbot, page loader, custom cursor, or animated background
- Analytics until there is a clear question to measure

## 2. Evidence and constraints

The resume supplied for planning contains these high-signal facts:

- University of Toronto, Bachelor of Applied Science in Computer Engineering, September 2020 to April 2025
- Software Engineering Intern at Zebra Technologies, May 2023 to September 2024
- Rust authentication and authorization services supporting API access for more than 200 autonomous robots
- A Rust integration test suite with 99% code coverage
- Inokta, co-developed from June 2025 to June 2026, with Next.js, FastAPI, TypeScript, Python, LangGraph, ChromaDB, WebSockets, and MCP
- Searchington, with a resume-reported response-time improvement of more than 70% from Redis caching
- ChromaMap, with a resume claim of more than 300% improvement in browse/load performance from a level-of-detail tiling scheme; omit the number in the first release because the actual before/after timings are unavailable
- GanttWise, a full-stack task-planning project using deep reinforcement learning

Use the exact qualifiers from the resume. For example, say "co-developed Inokta," not "founded" or "built alone." Do not expose confidential Zebra or Inokta material.

All four projects are private and have no approved repository, demo, screenshot, recording, or diagram for public use. The first release will use text-only project evidence from approved resume facts. It will render no disabled Source/Demo controls and will not create synthetic project artifacts.

The current resume PDF is not tagged for accessibility and contains contact details that must remain private. The HTML site contains the essential resume information. Shaibal will manually upload a sanitized, accessible public version after Phase 6; until then the site must render no resume action or placeholder.

## 3. Positioning and draft message

### Positioning

Use this category:

> Software Engineer - Backend and Full-Stack Systems

Do not lead with unemployment, "new grad," a list of technologies, or a vague claim about passion. Lead with shipped work and the problems Shaibal has handled.

### Draft first-viewport copy

Name:

> Shaibal Muhtadee

Headline:

> I build reliable software systems.

Supporting copy:

> Toronto-based software engineer with 16 months at Zebra Technologies, including building authentication services that secured API access for more than 200 autonomous robots. I also co-developed an AI workspace that turns documents into editable entity graphs.

Primary actions:

- View experience
- Open resume
- Connect on LinkedIn

Secondary links:

- GitHub

Use the approved availability copy from `CONTENT.md`: open to software engineering broadly, with a preference for backend and full-stack work across Canada and qualifying U.S. opportunities. Keep the longer TN/H-1B wording in a compact availability/contact note rather than crowding the main headline.

## 4. Information architecture

Build one focused home page. Keep it short enough to scan in five to seven desktop screens. Do not add project-detail routes to the first release; the content model can support them later if publishable evidence becomes available.

### Header

- On desktop, the selected Split Evidence composition uses the identity rail instead of a separate navigation bar. Keep Shaibal's name, Resume, contact links, and theme control visible there.
- On tablet and mobile, use one compact top row with Shaibal's name, Resume, and the same theme control. Do not duplicate focusable controls elsewhere in the document.
- Keep the page in a clear linear order instead of adding a hamburger menu or fixed bottom dock.
- Verify the hero's essential content at 320 by 568 and 390 by 844 pixels without treating all social links as mandatory above the fold.

### Hero

- Name, role, location, evidence-led headline, and short supporting copy
- Resume, GitHub, and LinkedIn available immediately
- A compact proof line using only verified facts, such as "200+ robots," "16-month internship," and "Rust integration suite: 99% coverage"
- Text should remain the likely Largest Contentful Paint element
- No headshot in the first release unless a strong professional photo earns the image cost

### Experience

Put Zebra immediately after the hero. A 16-month internship is the strongest hiring signal and should not sit below academic or independent projects. Show the role in full and do not hide achievements in an accordion.

Recommended structure:

- Company, role, Toronto location, and May 2023 to September 2024 dates
- One-line scope summary
- Four concise evidence bullets selected from the resume
- Relevant technologies grouped after the evidence

When a new role is added, render it above Zebra automatically by start date. Do not redesign the section.

### Selected projects

Projects add breadth after the professional evidence. Use an editorial hierarchy, not a grid of identical cards.

Use one section-level disclosure: "Source code and demos are private; descriptions are limited to publishable work." Keep each featured project between roughly 60 and 90 words.

1. **Inokta - primary featured project**
   - State the user problem and Shaibal's exact contribution.
   - Explain one hard decision: document ingestion, entity extraction, editable graph state, retrieval, streaming, or MCP integration.
   - Render no Source or Demo action.
2. **Searchington - infrastructure and performance**
   - Focus on crawler/index design, ranking, AWS hosting, and Redis caching. Qualify the 70% response-time result as a local Redis-versus-SQLite query-loading test.
3. **ChromaMap - systems and algorithms**
   - Focus on C++, map rendering, Dijkstra/A*, multithreading, and profiling. Publish a performance number only after converting the resume claim into a defensible baseline/final comparison or speed multiplier; otherwise omit it.
4. **GanttWise - compact additional project**
   - Present the React/Node/MongoDB pipeline and deep-reinforcement-learning scheduling work in a shorter row.

Each featured project needs:

- One-sentence problem
- Shaibal's contribution
- Two or three technical decisions
- A result or honest status
- Technology list capped at the tools that matter to the story
- No Source or Demo control; the section-level private-work note covers every project
- No screenshots, recordings, diagrams, or synthetic mockups in the first release

### About, education, and skills

- About: two short paragraphs about the engineering problems Shaibal wants to work on and how he approaches them. Avoid a generic life story.
- Education: one compact University of Toronto entry.
- Skills: group by capability, not a wall of badges. Suggested groups are Systems and backend, Product and web, Infrastructure, and Data and AI.
- Every prominent skill should connect to a project or work bullet somewhere on the page.

### Contact

- LinkedIn as the primary contact path, plus GitHub and resume links
- A specific closing line about the roles Shaibal wants
- Do not publish the personal email address or phone number, including inside the downloadable resume.
- Export a sanitized public resume with the domain, LinkedIn, and GitHub instead of private contact details. A dedicated domain email alias can be added later only if Shaibal approves it.
- Do not add a contact form in the first release.

## 5. Design brief and constraints

Shaibal selected Impeccable's conventional "play it straight" direction and Composition A, "Split Evidence." The design makes real work immediate through a calm identity rail and a denser evidence stream. It must remain easy to scan in both themes without slipping into a generic navy-and-teal coding aesthetic.

The visual work must carry four product truths: reliable systems work, technical breadth, measurable evidence, and credible early-career scope. It should pair large claims with small factual annotations and keep the interface behind the work.

This brief borrows the reference sites' clarity, not their identity:

- From Brittany Chiang: immediate role/value proposition, strong scan order, visible resume action, and restrained interaction
- From Starfolio: typed content, section ordering and visibility controls, and mobile-first simplicity
- Do not copy Brittany's palette, proportions, navigation, or sticky behavior. Shaibal's split uses its own grid, hierarchy, theme system, and mobile collapse.
- Do not copy Starfolio's fixed bottom dock, hidden work details, long optional-section stack, or same-size card grid.

### Visual constraints

- Use the approved Split Evidence light composition and its derived dark theme as the visual north star. The approved desktop comp is `.impeccable/mocks/canon-split-evidence-approved.png`; the approved mobile dark adaptation is `.impeccable/mocks/canon-split-evidence-mobile-dark.png`.
- Implement every meaningful foreground, background, border, focus, and accent color through semantic CSS custom properties. Light and dark themes keep the same typography, spacing, hierarchy, and control dimensions.
- Choose a typeface with a defensible connection to the selected world. Self-host and subset it, keep it within the font budget, and do not fetch it from a third party.
- Use type scale, weight, rules, and whitespace for hierarchy. Do not use monospaced type merely to signal "technical."
- Keep body copy between 65 and 75 characters per line.
- Make the text-only project evidence feel deliberate through typography, layout, and hierarchy. Do not use stock illustrations, fake browser chrome, synthetic project screenshots, or decorative code snippets to fill the missing media.
- Avoid repeated icon-heading-text cards, decorative section numbers, gradient text, and skill badge walls.
- Use icons only when their meaning is clear and include accessible names.

### Layout

- Desktop: a fluid 12-column container, maximum width around 1180 pixels. The identity rail occupies the left side and the evidence stream the right; the rail may be sticky only when its full content remains reachable at short viewport heights.
- Tablet: collapse the split into one content column with a compact top row and disable sticky positioning.
- Mobile: one column, 20 to 24 pixel side gutters, ordinary document flow, and no fixed dock. Put Resume and the theme control beside the name in the compact top row; at narrow widths, let the utilities wrap to a second row rather than shrinking touch targets or clipping the name.
- Use content-driven breakpoints. Start testing near 640, 900, and 1100 pixels, then adjust where the content breaks.

### Interaction and motion

- Keep core content visible without JavaScript.
- Use one real button for theming. Its visible and accessible action label changes between "Dark mode" and "Light mode"; the decorative sun or moon icon is hidden from assistive technology. Do not combine the changing action label with `aria-pressed`.
- On first visit, use CSS `prefers-color-scheme`. A valid stored `light` or `dark` choice overrides the system preference; an invalid value, blocked storage, or unavailable storage falls back safely to the system theme.
- Apply a stored choice before first paint with one tiny dependency-free inline head script. Set `color-scheme` for native controls, make no network request, and hide the theme button when scripting is unavailable so it never becomes a dead control.
- Do not animate initial theme resolution, use `transition: all`, or change geometry between themes. Manual switching may use a brief color transition only when reduced motion is not requested.
- Use CSS-only hover/focus treatment on links and project media.
- Permit one authored motion detail derived from the selected visual world. It must use transform or opacity, never block input, and disappear under `prefers-reduced-motion`.
- Do not add scroll-jacking, typewriter text, cursor spotlights, parallax, or identical reveal animations on every section.
- All pointer targets must remain usable without hover. Meet the WCAG 2.2 AA 24 by 24 CSS pixel target rule or a defined exception, and use at least a 44 by 44 CSS pixel target for the mobile theme control and other primary touch controls.

## 6. Technical architecture

### Stack

- Current stable Astro, pinned in the lockfile
- Static output
- Strict TypeScript
- Astro components and scoped plain CSS with custom-property design tokens
- Astro content collections for projects and experience
- Astro image tooling for responsive AVIF/WebP output and intrinsic dimensions
- pnpm for package management
- Playwright for smoke and responsive tests
- axe-core for automated accessibility checks
- Lighthouse CI for performance gates
- Impeccable as project-local design tooling only

Do not add React, Next.js, Tailwind, a CMS, or a client-side router to the first release. This is a content site. Astro should ship static HTML with no framework hydration; the only required client JavaScript is the small dependency-free theme initializer and button handler, kept inside the sub-20 KB JavaScript target.

### Proposed repository shape

```text
portfolio2026/
|-- public/
|   |-- favicon.svg
|   |-- images/
|   `-- resume/shaibal-muhtadee-resume.pdf
|-- src/
|   |-- components/
|   |   |-- layout/
|   |   |-- sections/
|   |   `-- ui/
|   |-- content/
|   |   |-- experience/
|   |   `-- projects/
|   |-- data/
|   |   |-- sections.json
|   |   |-- sections.ts
|   |   |-- site.json
|   |   `-- site.ts
|   |-- layouts/BaseLayout.astro
|   |-- pages/index.astro
|   |-- styles/
|   |   |-- global.css
|   |   |-- home.css
|   |   `-- tokens.css
|   `-- content.config.ts
|-- scripts/
|   `-- validate-content.mjs
|-- tests/
|   `-- portfolio.spec.ts
|-- .github/workflows/quality.yml
|-- .gitignore
|-- astro.config.mjs
|-- BUILD.md
|-- CONTENT.md
|-- PRODUCT.md
|-- DESIGN.md
|-- eslint.config.js
|-- lighthouserc.cjs
|-- package.json
|-- playwright.config.ts
|-- pnpm-lock.yaml
|-- prettier.config.mjs
`-- tsconfig.json
```

`PRODUCT.md` is created during Impeccable init. `DESIGN.md` is documented from the built and reviewed visual world at the end of the current new-work flow. Do not create empty placeholders for either file.

### Content model

Keep content and presentation separate. Validate content at build time.

| Data source           | Required fields                                                                       | Optional fields                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Project collection    | title, summary, start, order, featured, contribution, decisions, technologies, status | end, current, supported outcome, repository URL, demo URL, case-study flag, image, image alt, disclosure note |
| Experience collection | company, role, location, start, summary, highlights, technologies                     | end, current, company URL, logo, confidential note                                                            |
| Site config           | name, role, location, social URLs, contact URL, resume path, description              | availability, work-authorization wording, public email alias, analytics ID                                    |
| Section config        | id, label, order, enabled                                                             | nav visibility, display variant                                                                               |

Use collection schemas for per-entry types and a separate `scripts/validate-content.mjs` aggregate check for cross-entry rules. The build must fail on missing required data, duplicate ordering, invalid URLs, an enabled section with no content, or an invalid current/end-date combination. For projects and experience, enforce exactly one timeline state: `current: true` with no end date, or a completed entry with an end date. Every project needs an explicit status such as live, private, prototype, or archived, plus either a supported outcome or an honest status statement in its copy. Require alt text when an image is informative; allow empty alt text only when the entry marks the image decorative.

For the first release, every project has `status: private`; repository URL, demo URL, image, and case-study flag remain unset. `CONTENT.md` records the approved Phase 0 facts, copy, qualifications, and deferred selections.

### Future update path

To add a full-time job:

1. Add one Markdown or MDX file under `src/content/experience/`.
2. Fill the validated frontmatter and write three to five evidence bullets.
3. Add approved media only if it helps explain the work.
4. Run type, accessibility, and production-build checks.

The experience section sorts the new entry automatically. Section order and visibility stay in `src/data/sections.json`; `src/data/sections.ts` validates that configuration and its registered renderers.

## 7. Core Web Vitals and resource budgets

Google evaluates Core Web Vitals at the 75th percentile, separately for mobile and desktop. The production target is:

| Field metric              |  Google "good" threshold |
| ------------------------- | -----------------------: |
| Largest Contentful Paint  |      2.5 seconds or less |
| Interaction to Next Paint | 200 milliseconds or less |
| Cumulative Layout Shift   |             0.10 or less |

Pre-deployment lab tests cannot prove a field-data pass. They should use tighter budgets so hosting, devices, and network variance have room.

### Release gates

| Lab check                     |           Required result |
| ----------------------------- | ------------------------: |
| Lighthouse mobile performance |              95 or higher |
| Largest Contentful Paint      |       2.0 seconds or less |
| First Contentful Paint        |       1.5 seconds or less |
| Total Blocking Time           |  100 milliseconds or less |
| Cumulative Layout Shift       |              0.05 or less |
| App-generated long tasks      | None over 50 milliseconds |

Pin Lighthouse CI in the lockfile and use a pinned Chrome toolchain in CI. Build once, serve `dist` through one fixed local command, and record the Chrome and Lighthouse versions in the job output. Run five times and gate on the median for the home page, using Lighthouse's default simulated-mobile setup and its desktop preset. Apply the same gate to any future generated case study.

### Initial-load transfer budgets

Network `transferSize` per route from the fixed test server with gzip enabled:

| Resource                             |                  Hard cap |
| ------------------------------------ | ------------------------: |
| Total                                |                    450 KB |
| JavaScript                           | 50 KB; target below 20 KB |
| CSS                                  |                     35 KB |
| HTML                                 |                     35 KB |
| Fonts                                |                    100 KB |
| Initial-view images combined         |                    200 KB |
| Single LCP image, if used            |                    120 KB |
| Initial requests                     |                        25 |
| Render-blocking third-party requests |                         0 |

Assert these budgets from the served network responses, not uncompressed files on disk. Keep raw `dist` sizes as diagnostic output only, and commit the fixed server command and compression settings with the Lighthouse configuration.

The resume PDF is excluded because it loads only after a click.

### Performance implementation rules

- Keep the hero as static HTML and do not animate or delay the LCP text.
- Generate responsive image widths and AVIF/WebP formats at build time.
- Set intrinsic width and height or `aspect-ratio` for every image.
- Eagerly load only an actual above-the-fold image. Lazy-load all other media.
- Give optional clips a poster image, `preload="none"`, visible controls, and user-initiated playback.
- Self-host and subset one font family. Preload only the above-the-fold face if measurement shows a benefit.
- Ship no runtime framework and no third-party scripts on the critical path.
- Resolve the theme locally before first paint with no network request, framework hydration, theme-related layout shift, or flash of the wrong saved theme. Theme switching must stay comfortably within the INP budget.
- Reserve space for all media and dynamic-looking components.
- Measure before using Impeccable's optimize command. Record before-and-after results.

After deployment, use PageSpeed Insights and Chrome UX Report data when enough traffic exists. A final Core Web Vitals claim must come from field data, not a single Lighthouse screenshot.

## 8. Accessibility requirements

- Meet WCAG 2.2 AA contrast: 4.5:1 for normal text and 3:1 for large text and meaningful UI graphics.
- Use one `h1`, logical heading order, semantic landmarks, lists, time elements, and real links or buttons.
- Add a visible-on-focus skip link.
- Give every interactive element a clear accessible name and visible keyboard focus.
- Test the theme control's changing accessible name, keyboard activation, focus visibility, and touch target in both themes.
- Meet Focus Not Obscured (Minimum), including when the header or any identity rail is sticky.
- Preserve a useful page with CSS and JavaScript disabled.
- Do not encode meaning with color alone.
- Write useful alt text for any future approved informative image and empty alt text for decorative images.
- Support keyboard-only use, 200% zoom, 400% reflow, reduced motion, forced colors, and coarse pointers.
- Test at 320, 360, 390, 768, 1024, 1280, and 1440 CSS pixels.
- Run axe on every route, then perform manual keyboard and screen-reader spot checks. Automated tools are not sufficient.

## 9. SEO, privacy, and link quality

- Use a unique title and description for the home page and any future case study.
- Add canonical URLs, sitemap, robots.txt, favicon, Open Graph image, and social metadata.
- Add `Person` structured data with only verified `sameAs` profiles.
- Keep the main resume content in HTML; treat the PDF as a download.
- Open external links normally. If a new tab is used, disclose it accessibly and add safe `rel` values.
- Validate every external link during the release check. Render no empty or dead Demo/Source actions.
- Publish neither the personal email nor phone number. Add a dedicated public email alias only with approval. Add analytics only after defining a useful event and reviewing its privacy cost.

## 10. Impeccable design workflow

Impeccable is development-time guidance and deterministic inspection. It must not enter the production bundle.

Phase 1 tool record:

- CLI: 3.5.0
- Installed skill: 4.0.4
- Runtime used for installation: Node 24.14.0
- Scope/provider: project-local Codex installation
- Hook review: complete; approval remains deferred until UI source exists. Re-review executable hook files after any Impeccable update.
- License: the upstream Apache-2.0 terms and attribution notice are retained beside the installed project-local skill.

1. Confirm Node 22.18.0 or newer.
2. Install it at project scope: `npx impeccable install --providers=codex --scope=project`.
3. Record both the installed CLI version and skill version, then review the generated files. The inspected main branch contains documentation/version drift, so follow the installed skill's reference files rather than stale README summaries.
4. Review the project hook before approving it. The hook executes third-party repository-local Node code after UI edits and on stop.
5. Run `$impeccable init` to create `PRODUCT.md` from verified audience, outcome, evidence, and constraints.
6. Run `$impeccable shape portfolio` and approve the brief before coding.
7. Enter the installed skill's ordinary new-work flow. Run its required concept seed, present the assigned direction and challengers, and get Shaibal's choice. Do not rely on the deprecated `craft` alias.
8. When image generation is available, render the required composition options and get approval before coding.
9. Record the approved direction contract in the emitted page as the first child of `body`. Confirm the production build preserves it. Do not write `DESIGN.md` yet.
10. Build the first complete responsive pass. Use `$impeccable live` only when comparing a small number of real alternatives on a running local site.
11. Run `$impeccable critique <homepage>` and `$impeccable audit <target>` once content and behavior are complete. Use adapt or optimize only against measured findings, then run one bounded polish pass.
12. Follow the new-work finish sequence: one batched desktop/mobile inspection, one fix batch, at most one confirmation round, then the shipped finish reviewer and its verdict process.
13. After the finish verdict closes, use the shipped documenter to write `DESIGN.md` and its sidecar from the built result.
14. Run the deterministic detector only where the installed hook or finish flow did not already run the same scan. Avoid duplicate scans.

Treat the portfolio as Impeccable's **Experience** mode: real work leads from the first viewport and the interface recedes. Apply its "prove, don't claim" rule throughout.

If Impeccable source or generated derivative files are committed, retain the Apache-2.0 license and NOTICE requirements. Copy its documented `.gitignore` block exactly so shared design artifacts remain tracked and screenshots, sessions, caches, local config, and live state stay out of Git.

## 11. Test plan

### Automated on every change

- Format and lint
- `astro check` with strict TypeScript
- Production build
- Content-schema validation
- Playwright smoke tests for navigation, resume, contact, and the absence of empty Source/Demo actions
- axe accessibility scan for every route

### Release candidate

- Lighthouse CI: five mobile and five desktop runs for the home page; add the same gate to any future generated case study
- Network transfer-budget assertions against the fixed production test server; raw output sizes remain diagnostic
- Keyboard-only pass
- Screen-reader spot check for page outline, links, project status text, and dates
- Responsive visual pass at the target widths
- No horizontal overflow at 320 pixels
- No layout shift when fonts and images load
- Broken-link check
- Reduced-motion and forced-colors check
- System-light and system-dark first visits, manual override persistence after reload, invalid or unavailable storage fallback, and JavaScript-disabled behavior
- Axe and manual contrast checks in both themes, including the focus indicator and theme control
- Content proofread against the resume and approved project artifacts

### Browser matrix

- Latest stable Chrome and Firefox
- Latest stable Safari on a real Mac, an Xcode Simulator, or a cloud browser service. Playwright WebKit is preflight coverage, not proof of Safari compatibility.
- iOS Safari on a real iPhone, an Xcode Simulator, or a cloud browser service
- Android Chrome on one real or emulated phone

## 12. Implementation plan

### Phase 0 - Content and asset inventory (complete)

- Confirm GitHub, LinkedIn, domain, location, availability, and work-authorization wording; keep personal email and phone private.
- Record that all project repositories, demos, screenshots, recordings, and diagrams are private and unavailable for publication.
- Prepare text-only evidence blocks from approved resume facts; do not create separate project-detail pages for the first release.
- Verify every metric and clarify Shaibal's individual contribution to team projects.
- Decide whether to regenerate the resume as a tagged PDF.

Exit: no unsupported copy remains and every featured project has an approved text-only evidence plan.

### Phase 1 - Product and visual brief

- [x] Install Impeccable locally and record both its CLI and skill versions.
- [x] Create `PRODUCT.md` with `$impeccable init`.
- [x] Run `$impeccable shape portfolio`.
- [x] Complete the installed new-work direction selection. Shaibal selected the conventional "play it straight" path, with Brittany Chiang and Starfolio as craft benchmarks.
- [x] Complete the visual composition round and select Composition A, "Split Evidence," with a visible dark-mode control.
- [x] Approve the derived mobile dark-theme composition and final shape brief.
- [x] Prepare the emitted direction contract. Do not create `DESIGN.md` before the build.

Exit: content hierarchy, one visual direction, and one desktop/mobile composition are approved before component work.

### Phase 2 - Static foundation

- [x] Scaffold Astro with strict TypeScript and pnpm.
- [x] Add content schemas, site config, section registry, base layout, global tokens, metadata, and image pipeline.
- [x] Place the approved direction contract where it survives the generated HTML and verify it after the first production build.
- [x] Add CI checks without deployment steps.

Exit: production build succeeds with validated sample content and zero unnecessary client JavaScript.

Phase 2 verification, August 6, 2026:

- Prettier and ESLint pass with no reported issues.
- Astro's strict check passes across 17 files with zero errors, warnings, or hints.
- Aggregate validation passes for one experience entry and four project entries, including privacy and timeline rules.
- The static production build emits one route and preserves the direction contract, canonical URL, and private-contact guards.
- The built page has no external executable JavaScript; the two dependency-free theme scripts total 2,358 bytes.
- Five Chromium tests pass for verified content and metadata, theme persistence, invalid or blocked storage, JavaScript-disabled behavior, axe accessibility, and 320-pixel reflow.
- Lighthouse and transfer-budget gates remain scheduled for Phase 5; this phase does not claim field Core Web Vitals results.

### Phase 3 - Core page and project evidence

- [x] Build the identity header and hero plus experience, selected projects, about/education/skills, and contact sections.
- [x] Drive the four page sections through the validated section registry so their order and visibility remain configuration-controlled.
- [x] Keep project evidence on the home page and render no empty media or external-action slots.
- [x] Use all approved real content. The optional personal detail remains intentionally omitted until Shaibal confirms one truthful choice.
- [x] Keep the resume disabled with no placeholder while the current private PDF remains unsafe. Shaibal will manually upload the sanitized, accessible public version after Phase 6.

Current status, August 6, 2026:

- The complete core page and project-evidence implementation is present.
- Prettier, ESLint, Astro's strict check, aggregate content validation, and the static production build pass. Astro reports 26 files with zero errors, warnings, or hints.
- The build verifier confirms all four sections and projects, exact public profile links, private-contact and disabled-resume guards, the qualified metrics, the direction contract, and 2,358 bytes of inline theme JavaScript.
- Eight Chromium tests pass for content and section order, project privacy, contact paths, short-desktop action visibility, theme persistence and fallbacks, JavaScript-disabled use, axe accessibility, and horizontal reflow from 320 through 1280 CSS pixels.
- Impeccable's deterministic source detector reports no findings. The bounded visual inspection is complete; final critique, audit, finish review, and documentation remain scheduled for later phases.
- Phase 3 is complete. The final public resume upload is a post-Phase 6 manual launch input and does not block Phases 4 through 6. The existing private resume must remain unpublished.
- Deployment remains deferred, and `DESIGN.md` will be written only after the final Impeccable finish review.

Exit: all real content is present, every action works, and no placeholder survives.

### Phase 4 - Responsive and accessible pass

- [x] Apply content-driven small-phone spacing, safe-area handling, and a faster mobile scan order.
- [x] Put the Canada/U.S. eligibility summary in the identity rail and move the private-project disclosure before the projects.
- [x] Add banner/main landmarks, skip-link and fragment focus targets, accessible date separators, theme-change announcements, native tap acknowledgment, active states, and a reusable proof-label pattern.
- [x] Replace the blanket reduced-motion override with a targeted alternative and preserve forced-colors behavior.
- [x] Add automated coverage for light/dark axe scans, keyboard order, skip and fragment focus, 44-pixel controls, 320-pixel CTA visibility, 320-to-2560 reflow, text-spacing overrides, reduced motion, forced colors, headings, and landmarks.
- [x] Run the required independent Impeccable critique assessments and code audit/adapt work.

Phase 4 implementation report, August 6, 2026:

- Assessment A scored the applicable Nielsen heuristics 26/32. Its main findings were late work-authorization context, a slow small-phone opening, a dense project middle, missing touch feedback, and a weak repeatable evidence signature. Those clear findings were addressed without adding cards, navigation, hidden content, or decorative media.
- Assessment B ran the deterministic detector exactly once against `src/pages/index.astro` and returned zero findings. The scan is narrow because the target imports the rendered components and styles.
- The combined critique is stored at `.impeccable/critique/2026-08-06T16-08-34Z__src-pages-index-astro.md` with the requested stable slug and trend metadata.
- Calculated contrast ratios range from 5.76:1 to 17.42:1 for body, muted, accent, and focus text/surfaces. The lowest normal-text control pair is the dark primary button at 4.60:1. Active primary buttons now use a dedicated darker token rather than the light-blue accent.
- Both fresh in-app browser critique attempts were blocked by the browser security policy before localhost loaded. No live overlay or screenshot was claimed.
- The new automated suite could not run in this Codex sandbox: Astro, Prettier, ESLint, TypeScript/Astro check, and Playwright package files are pnpm hardlinks that the process cannot open (`EPERM`). An escalated build was also rejected because the local Codex account had exhausted its approval/usage allowance. This is an environment failure, not a passing test result.
- Real Safari, iOS Safari, Android Chrome, NVDA, and VoiceOver remain release-candidate checks requiring a real device, simulator, or cloud browser. Playwright Firefox and WebKit projects are configured as preflight coverage, not substitutes for real Safari.

Exit status: implementation is complete, but the Phase 4 exit condition is not proven until the expanded automated suite and manual browser/screen-reader matrix run successfully outside the blocked sandbox.

### Phase 5 - Performance and search pass

- [x] Add complete Open Graph and Twitter image metadata, crawler directives, canonical sitemap discovery, privacy-safe `ProfilePage`/`Person` JSON-LD, and a verified 1200×630 PNG social card.
- [x] Generate `sitemap.xml` from every built indexable HTML route and generate `robots.txt` from Astro's configured site URL.
- [x] Add build guards for metadata, structured data, crawler files, social-image type/dimensions, privacy, and executable-inline-JavaScript size.
- [x] Add local/fragment/structured-data link validation plus a bounded external-link mode that reports bot-protected checks as inconclusive.
- [x] Add a dependency-free fixed production server with deterministic gzip level 9, real 404s, immutable hashed-asset caching, and no SPA fallback.
- [x] Add served-network transfer assertions for every built route and five-run median Lighthouse CI configurations for mobile and desktop.
- [x] Pin the Node, pnpm, Playwright, and browser-install inputs already owned by the repository; configure CI to print versions and upload Lighthouse reports.
- [x] Optimize only measured problems. The current self-hosted Figtree files already use `font-display: swap` and Unicode ranges; the English route requests the 20,156-byte Latin WOFF2, so removing Latin-ext output would reduce disk size without a measured initial-transfer benefit. No preload was added.

Phase 5 implementation report, August 6, 2026:

- Before Phase 5, the generated snapshot was 65,899 raw bytes across HTML, CSS, two font subsets, and the favicon. Local gzip diagnostics were 6,098 bytes for HTML and 3,627 bytes for CSS; the likely initial payload was about 30 KB because the English page selects only the Latin font range.
- The social card is 45,883 bytes, 1200×630, and is referenced only by metadata, so it is not part of the normal page load.
- The fixed server was smoke-tested against the existing Phase 3 `dist`: it served the HTML with `Content-Encoding: gzip` and a 6,098-byte compressed body, and the dependency-free local/fragment link checker passed that one-route snapshot. These results validate the infrastructure only; they are not final Phase 5 measurements.
- The final production build, served transfer budgets, axe/browser suite, and five mobile plus five desktop Lighthouse runs could not execute for the same pnpm-hardlink `EPERM` sandbox failure described above. The Lighthouse runner failed before collection when Playwright's installed package entry point could not be opened.
- The required lockfile pin for `@lhci/cli@0.15.1` remains unmet. A lockfile-only pnpm add retried registry access and timed out with `EACCES`; escalated network/package access was unavailable. The committed runner uses the exact `0.15.1` package through `pnpm dlx` so CI is deterministic by version, but this does not satisfy the stricter lockfile requirement.
- Automated external fetches failed because outbound network access is blocked. Web verification found the GitHub profile and an indexed LinkedIn profile, but LinkedIn could not be fetched directly. The GitHub profile is live but its public bio/README still says “4th Year Computer Engineering Student” and “aspiring web developer”; update that before deployment because it conflicts with the portfolio's graduate/software-engineer positioning.
- Syntax checks pass for every new Node/CJS script, the sitemap generator emits the canonical home URL, PNG dimensions and visual layout were verified, the fixed gzip server starts correctly, the local link checker runs, and `git diff --check` is clean.
- Field Core Web Vitals remain pending deployment and sufficient traffic. Lighthouse is a lab gate and cannot prove the 75th-percentile field result.

Exit status: Phase 5 implementation is complete, but its exit condition is not proven. Rerun `pnpm install --frozen-lockfile`, add and lock `@lhci/cli@0.15.1`, then run `pnpm test:release` in an unrestricted environment. Do not begin Phase 6 until formatting, lint, Astro check/build, all configured browsers, served budgets, and both Lighthouse matrices pass.

### Phase 6 - Final review

- Proofread all claims against approved evidence.
- Run the new-work bounded inspection, finish reviewer, fix/verdict process, and shipped documenter.
- Confirm the documenter created `DESIGN.md` and its sidecar from the final built world.
- Test final desktop and mobile builds in the browser matrix, using real or cloud Safari coverage where required.
- Freeze scope and prepare a deployment recommendation separately.

Exit: the definition of done below is satisfied.

## 13. Definition of done

- The home page states role, evidence, and contact paths in the first viewport.
- The site contains three strong featured projects and the Zebra experience without filler.
- All claims, metrics, dates, and contributions are verified.
- No placeholder, dead link, hidden essential evidence, empty section, or fake action remains.
- Adding or removing a project, experience, or section requires only content/config changes.
- All routes build as static HTML and stay within the transfer budgets.
- Lighthouse lab gates pass on mobile and desktop. Field CWV verification remains explicitly pending deployment and traffic.
- Automated and manual accessibility checks pass.
- The site works from 320 pixels upward without horizontal overflow.
- The final visual design is recognizably Shaibal's and does not clone either reference site.
- Deployment has not been selected or configured.

## 14. Deferred manual inputs

1. Select one truthful personal detail from `CONTENT.md`, or omit the personal note. Omission is the default until a line is confirmed.
2. After Phase 6 is complete, Shaibal will manually upload the sanitized, accessible public resume. The current private PDF must not be committed or published.

Neither item blocks Phases 4 through 6. Resume enablement and its final link check belong to the post-Phase 6 launch handoff.

## 15. Sources

- [Google Core Web Vitals](https://web.dev/articles/vitals#core-web-vitals)
- [Astro: Why Astro](https://docs.astro.build/en/concepts/why-astro/)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro images](https://docs.astro.build/en/guides/images/)
- [Lighthouse CI configuration](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)
- [Google ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [U.S. State Department TN guidance](https://travel.state.gov/content/travel/en/us-visas/employment/visas-canadian-mexican-usmca-professional-workers.html)
- [CBP Canadian TN procedure](https://www.help.cbp.gov/s/article/Article-1723?language=en_US)
- [USCIS TN guidance](https://www.uscis.gov/working-in-the-united-states/temporary-workers/tn-nafta-professionals)
- [U.S. State Department temporary worker guidance](https://travel.state.gov/content/travel/en/us-visas/employment/temporary-worker-visas.html)
- [Brittany Chiang portfolio](https://brittanychiang.com/)
- [Starfolio theme listing](https://astro.build/themes/details/starfolio/)
- [Starfolio source](https://github.com/webrating/starfolio)
- [Impeccable README](https://github.com/pbakaus/impeccable/blob/main/README.md)
- [Impeccable skill](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md)
- [Impeccable new-work workflow](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/reference/new-work.md)
- [Impeccable reference files](https://github.com/pbakaus/impeccable/tree/main/.agents/skills/impeccable/reference)
- [Impeccable license](https://github.com/pbakaus/impeccable/blob/main/LICENSE)
