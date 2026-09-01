---
title: Searchington
summary: Built a web search engine with a recursive crawler, HTML extraction, an inverted index, relevance metrics, and AWS hosting.
start: '2024-09'
end: '2024-12'
current: false
enabled: true
order: 5
featured: false
contribution: Built the crawler, index, query path, persistence, hosting, and cache behavior.
decisions:
  - Cached repeated query results in Redis instead of sending every request through the slower SQLite path.
  - Stored crawler and index data in SQLite to keep the project compact and inspectable.
technologies:
  - Python
  - Flask
  - Redis
  - AWS
  - SQLite
status: private
statusNote: Private completed project; source code and demos are unavailable for publication.
supportedOutcome: In local query-loading tests, Redis caching reduced response time by more than 70% compared with reading the same results from SQLite.
caseStudy: false
decorativeImage: false
---
