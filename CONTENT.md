# Portfolio content inventory

- Phase: 0 - content and asset inventory
- Status: complete; personal-detail selection is optional and the public-resume upload is deferred until after Phase 6
- Last updated: August 6, 2026

This file records approved facts, publication constraints, draft evidence, and unresolved content decisions. It is not final website copy.

## Publication boundary

Locked decisions:

- All projects are private.
- Publish no project repository URLs, demos, screenshots, recordings, diagrams, or code excerpts.
- Do not create synthetic screenshots or technical diagrams that could be mistaken for project evidence.
- Render no disabled or empty Source/Demo controls.
- Use only resume-level facts unless Shaibal explicitly approves additional detail.
- Use one section-level note: "Source code and demos are private; descriptions are limited to publishable work."
- Keep all Zebra and Inokta descriptions within already disclosed resume language.

This boundary does not prevent a credible portfolio. The project sections must prove judgment through concise descriptions of the problem, Shaibal's contribution, technical decisions, and honest status.

## Approved positioning baseline

Primary positioning:

> Software Engineer - Backend and Full-Stack

Headline:

> I build reliable software systems.

Supporting copy:

> Toronto-based software engineer with 16 months at Zebra Technologies, including building authentication services that secured API access for more than 200 autonomous robots. I also co-developed an AI workspace that turns documents into editable entity graphs.

Shaibal is open to software engineering roles broadly. Prioritize backend and full-stack roles over frontend-only and DevOps-only positioning. Do not position him as an AI specialist, a senior engineer, or only a student/new graduate. Applied AI supports the main backend/full-stack story.

## Identity and contact

Verified from the supplied resume:

| Field          | Current value                            | Publication state                                  |
| -------------- | ---------------------------------------- | -------------------------------------------------- |
| Name           | Shaibal Muhtadee                         | Ready                                              |
| Location       | Toronto, Ontario                         | Ready                                              |
| Personal email | Redacted; do not store in the repository | Exclude from the website and public resume         |
| LinkedIn       | linkedin.com/in/shaibalmuhtadee          | Ready                                              |
| Domain         | shaibalmuhtadee.com                      | Confirmed                                          |
| GitHub profile | github.com/shaibalmuhtadee               | Confirmed; no project repository links will appear |
| Phone          | Present on resume                        | Exclude from the public site                       |

Contact policy:

- Use LinkedIn as the primary public contact path.
- Link the GitHub profile and domain.
- Publish neither the personal email nor phone number in HTML, metadata, structured data, or the downloadable resume.
- Shaibal will manually upload a separate sanitized, accessible public resume after Phase 6. It must exclude private contact details and use the domain, LinkedIn, and GitHub as its contact line.
- Consider a dedicated domain email alias later, but do not create or publish one without approval.

Search scope:

- Open to software engineering roles, with a preference for backend and full-stack work over frontend-only or DevOps-only work.
- Based in Toronto and open to onsite or hybrid work where practical.
- Open to remote roles across Canada.
- Open to U.S. roles, including remote U.S. companies, where the role and employer can support an appropriate work-authorized path.
- Canadian citizen.

Draft availability copy:

> Open to full-time software engineering roles across Canada and select U.S. opportunities, with a preference for backend and full-stack work.

Approved work-authorization line:

> Canadian citizen based in Toronto - open to Canada-wide remote and U.S. roles; prepared to seek TN status for qualifying USMCA professional positions, or employer-sponsored H-1B.

Use "TN status," not "TN visa." The wording must not imply current U.S. work authorization, guaranteed TN eligibility, or no sponsorship requirement. TN treatment depends on the profession, duties, employer, credentials, and government determination; a prospective employer files an H-1B petition. This is cautious public copy, not legal advice.

Official references:

- [U.S. State Department TN guidance](https://travel.state.gov/content/travel/en/us-visas/employment/visas-canadian-mexican-usmca-professional-workers.html)
- [CBP Canadian TN procedure](https://www.help.cbp.gov/s/article/Article-1723?language=en_US)
- [USCIS TN guidance](https://www.uscis.gov/working-in-the-united-states/temporary-workers/tn-nafta-professionals)
- [U.S. State Department temporary worker guidance](https://travel.state.gov/content/travel/en/us-visas/employment/temporary-worker-visas.html)

## Page order

1. Hero
2. Zebra Technologies experience
3. Selected projects
4. About, education, and focused skills
5. Contact

Zebra appears before projects because the 16-month internship is the strongest professional signal.

## Experience inventory

### Zebra Technologies

- Role: Software Engineering Intern
- Location: Toronto, Ontario
- Dates: May 2023 to September 2024
- Status: completed

Candidate evidence, all derived from the resume:

- Built Rust authentication and authorization services that secured API access for more than 200 autonomous robots.
- Developed TypeScript APIs for storing and retrieving API keys, JWTs, and robot configuration data, and implemented attribute-based access control with a custom policy parser.
- Built internal React and Flutter interfaces for managing secrets, access policies, and robot configurations.
- Created a Rust integration test suite with 99% code coverage across authentication flows, API behavior, and service communication.
- Developed a CLI that connected secrets from GitHub, GCP, and AWS for development workflows.
- Containerized services with Docker and supported CI/CD deployments to Kubernetes environments.

Final website copy should use four bullets. Do not imply that 99% coverage applied to the entire Zebra codebase; it applied to the integration test suite described in the resume.

## Project inventory

Every current project entry has `status: private`. The first release will show no project-detail route or external project action.

Use three featured editorial rows - Inokta, Searchington, and ChromaMap - at roughly 60 to 90 words each. Keep GanttWise as a one-line Additional work entry unless its approved reasoning is strong enough to justify more space.

### Inokta

- Dates: June 2025 to June 2026
- Origin: started collaboratively with two close friends
- Role qualifier: co-created and co-developed; never use sole founder, led alone, or built alone
- Current status: the project remains private/stealth; Shaibal paused active work in June 2026 to focus on his job search
- Technologies: Next.js, FastAPI, TypeScript, Python, LangGraph, ChromaDB, WebSockets, MCP
- Public evidence format: primary text-only project block

Verified scope:

- An AI workspace that transforms uploaded documents into an editable model of entities, attributes, and relationships.
- Alice, a LangGraph-based harness, extracts entities and generates persistent text, table, and graph modules.
- The ingestion and retrieval pipeline includes PDF extraction, table detection, chunking, embeddings, and semantic search with ChromaDB.
- Users can create, edit, and connect entities to correct or extend inferred relationships.
- AI responses and tool activity stream over WebSockets with session-scoped conversations and MCP tools.

The resume-level description is approved for public use. Do not mention the current YC application. An application is not an outcome, and advertising it while seeking full-time work can create an unnecessary concern about divided commitment. If the project reaches a verifiable milestone later, update the entry then.

Draft publishable technical choice and reasoning:

> We represented extracted knowledge as editable entities and relationships instead of treating model output as final prose. That let users correct inference errors, preserve useful structure across sessions, and extend the model without reprocessing the source documents.

This reasoning follows directly from the approved editable-world-model behavior. Keep the wording in first person plural to reflect the three-person team.

### Searchington

- Dates: September 2024 to December 2024
- Technologies: Python, Flask, Redis, AWS, SQLite
- Public evidence format: featured text-only project block

Verified scope:

- Built a web search engine with a recursive crawler, HTML extraction, word lists, an inverted index, and relevance metrics.
- Stored crawler/index data in SQLite.
- Hosted the project on AWS and added Redis caching.

Draft publishable technical choice and reasoning:

> We cached repeated query results in Redis instead of sending every request through the slower SQLite path. In local query-loading tests, the cache reduced response time by more than 70% compared with reading the same results from SQLite.

The comparison is a local before/after benchmark, not production traffic. Keep that qualifier next to the metric.

### ChromaMap

- Dates: September 2022 to April 2023
- Technologies: C++, OpenStreetMap API, GTK, Git
- Public evidence format: featured text-only project block

Verified scope:

- Built geographic information system mapping software with C++ and OpenStreetMap data.
- Implemented Dijkstra and A* pathfinding heuristics for routing and travelling-salesman work.
- Built a level-of-detail tiling scheme and used multithreading, stack traces, and flame graphs to improve performance.

Draft publishable technical choice and reasoning:

> We added level-of-detail tiling so navigation rendered only the map detail needed for the current view instead of drawing the full world at maximum detail. Timed before/after navigation tests showed a substantial reduction in rendering work and faster browsing.

The test method is approved: world-map rendering was timed during user navigation before and after the level-of-detail scheme. The actual baseline and final times are not recorded here, so omit the ambiguous "over 300%" claim. Add a speed multiplier or time reduction only if those values become available.

### GanttWise

- Dates: September 2024 to April 2025
- Technologies: Python, React, TypeScript, Node.js, MongoDB
- Public evidence format: compact text-only project row

Verified scope:

- Built a web application that applied deep reinforcement learning to task planning under constraints.
- Used Python scripts to preprocess datasets and debug learning agents.
- Connected a React/TypeScript interface to a Node.js and MongoDB pipeline for real-time project updates.

No numerical outcome is approved. Describe the technical scope and completed-project status without inventing adoption or performance claims.

## About copy

Approved professional draft:

> I'm a Toronto-based software engineer interested in backend and full-stack work where reliability, performance, and product usability meet. My experience spans authentication services, developer tools, data pipelines, AI-assisted interfaces, and performance-sensitive systems in Rust, TypeScript, Python, and C++.
>
> I like tracing problems across system boundaries, from APIs and storage to the interface people use, and validating decisions with tests, profiling, and before/after measurements. I'm looking for a team where I can own meaningful work, learn from experienced engineers, and ship software used in real operations.

### Personal-detail candidates

Do not publish all ten. Select one truthful line during final content review. The first five are supported by the existing work history; the last five are prompts that require Shaibal to supply a real detail.

1. I like building ambitious side projects with close friends.
2. I enjoy tracing performance bottlenecks and turning slow interactions into measured improvements.
3. I like moving between backend services and user-facing interfaces when a problem crosses both.
4. I'm drawn to AI products that let users inspect and correct model output.
5. I enjoy learning systems from first principles, whether that means building a search index or implementing routing algorithms.
6. Outside software, I spend time [specific sport or outdoor activity].
7. I unwind with [specific game, puzzle, or creative hobby].
8. I enjoy exploring Toronto through [specific food, music, neighborhood, or activity].
9. I regularly read or listen to [specific technical or nontechnical subject].
10. A non-software skill or project I'm proud of is [specific truthful detail].

Candidates 6 through 10 are prompts, not facts. They must never enter production with placeholders or invented answers.

## Education

- University of Toronto
- Bachelor of Applied Science in Computer Engineering
- September 2020 to April 2025
- Toronto, Ontario

Keep this entry compact. Do not add coursework or GPA unless Shaibal supplies and approves it.

## Skills inventory

Group skills by demonstrated capability rather than rendering every item as a badge.

| Group               | Evidence-backed skills                                                          |
| ------------------- | ------------------------------------------------------------------------------- |
| Backend and systems | Rust, Python, TypeScript, C++, FastAPI, Flask, Node.js, REST APIs, WebSockets   |
| Product and web     | React, Next.js, Flutter, HTML/CSS                                               |
| Infrastructure      | Docker, Kubernetes, AWS, GCP, Linux, Git, CI/CD                                 |
| Data and AI         | LangGraph, ChromaDB, MongoDB, Redis, SQLite, vector embeddings, semantic search |

Remove any skill that cannot be connected to an experience or project entry.

## Copy rules

- Use "co-developed" for Inokta.
- Attach the 200+ robot claim only to the Zebra authentication-service work.
- Attach 99% coverage only to the Rust integration test suite.
- Do not publish ChromaMap's 300% claim without clarification.
- Publish Searchington's 70% claim only with the local Redis-versus-SQLite query-loading qualifier.
- Do not imply that a private project is live, deployed, open-source, or currently maintained.
- Do not call private project descriptions case studies unless they contain enough approved technical reasoning to justify the label.
- Do not apologize for private code. State the status once and move on.

## Phase 0 resolutions

1. Roles: open to software engineering broadly; prioritize backend and full-stack.
2. Geography: Toronto-based, Canada-wide remote, and open to appropriate U.S. opportunities.
3. Work authorization: cautious public wording verified against current U.S. government guidance.
4. Availability: open to full-time software engineering roles.
5. Public links: domain, LinkedIn, and GitHub approved; personal email and phone excluded.
6. Inokta: private/stealth collaborative project; resume-level description approved; Shaibal's active work paused in June 2026.
7. Technical reasoning: publishable drafts written for Inokta, Searchington, and ChromaMap.
8. Metrics: Searchington's local Redis-versus-SQLite test can use the qualified 70% result; ChromaMap's ambiguous 300% figure is omitted until actual timings are available.
9. About: professional draft written; one personal detail will be selected during final review. No invented detail may ship.
10. Resume: Shaibal will manually upload the sanitized, accessible public version after Phase 6. It does not block Phases 4 through 6.

## Phase 0 completion

Phase 0 is complete. Every planned public claim has an approved source or an explicit qualification, no private artifact is part of the site, and the two deferred selections have safe defaults: omit a personal note until confirmed, and keep the resume action absent until Shaibal uploads the sanitized public PDF after Phase 6.
