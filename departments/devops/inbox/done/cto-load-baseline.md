## CTO Directive — DevOps

**From:** CTO
**Date:** 2026-05-30T09:03Z
**Re:** Pivot load time baseline

Before the vanilla-js-restructure pivot begins code changes, measure and record current page load time (DOMContentLoaded event timestamp). This is the baseline for the pivot's kill criterion (">50% load time regression → rollback").

Add the measurement to your next CI verify report.
