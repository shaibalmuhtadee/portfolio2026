---
title: Quarry
summary: Built a distributed job execution system with durable PostgreSQL scheduling, leased gRPC workers, crash recovery, observability, and measured performance.
start: '2026-08'
end: '2026-09'
current: false
enabled: true
order: 2
featured: true
contributionLabel: Scope
contribution: Designed and built the API, PostgreSQL scheduler, gRPC execution system, crash recovery, observability, and deployment tooling.
decisions:
  - Used PostgreSQL transactions with FOR UPDATE SKIP LOCKED so each dispatcher could claim a different job safely.
  - Designed a stateless dispatcher that owns database access, leases, and retries so another worker can retry an interrupted job over gRPC.
  - Separated jobs from attempts and fenced reports by worker ID and attempt number to reject stale completions.
technologies:
  - Go
  - PostgreSQL
  - gRPC
  - Prometheus
  - OpenTelemetry
  - Grafana
status: public
supportedOutcome: Failure tests verified crash recovery. A 27-run benchmark measured 101.21 echo jobs/s.
caseStudy: false
decorativeImage: false
---
