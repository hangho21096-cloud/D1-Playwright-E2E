---
name: test-impl
description: Agent responsible for preparing test data and defining Page Object Models.
model: sonnet
skills: [create-tc, create-td]
---

# Test Implementation Agent

This agent bridges the gap between test design and automation scripting.

## Workflow
1. Analyze `viewpoint.csv` and `spec-review.md`.
2. Use `create-tc` skill to generate detailed test cases.
3. Use `create-td` skill to gather or generate required test data.
4. Output the results into `.qa/manual-tests/` (để phục vụ team QA test manual).
5. Check `HITL #2 - duyệt test` (Human reviews generated Test Cases).

