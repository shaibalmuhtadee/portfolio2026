---
title: ChromaMap
summary: Built a C++ geographic information system software with OpenStreetMap data, routing algorithms, and a performance-focused rendering pipeline.
start: '2022-09'
end: '2023-04'
current: false
enabled: true
order: 3
featured: true
contribution: Implemented routing heuristics and helped profile and improve map navigation and rendering behavior.
decisions:
  - Added level-of-detail tiling so navigation rendered only the map detail needed for the current view.
  - Used Dijkstra and A* heuristics for routing and travelling-salesman work.
  - Used multithreading, stack traces, and flame graphs to find and reduce rendering bottlenecks.
technologies:
  - C++
  - OpenStreetMap API
  - GTK
  - Git
status: private
supportedOutcome: Timed before-and-after navigation tests showed significantly faster browsing after level-of-detail tiling.
caseStudy: false
decorativeImage: false
---
