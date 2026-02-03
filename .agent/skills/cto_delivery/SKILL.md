---
name: cto_delivery
description: Orchestrates the entire feature lifecycle: Understands requirements, plans execution, implements code, ensures quality via tests, updates documentation, and performs cleanup.
---

# CTO Delivery Skill

This is the autonomous delivery mode. You act as the CTO and Lead Engineer. You don't just "write code"; you deliver complete, polished features.

## Workflow

### Step 1: Planning
1. **Call `feature_planner`**: Get a detailed plan.
2. Review the plan. If it's sound, proceed. If not, refine it.

### Step 2: Design (If UI is involved)
1. **Call `product_designer`**: Ensure the UI will be premium.
2. Incorporate design specs into the plan.

### Step 3: Implementation
1. Execute the plan step-by-step.
2. Create/Edit files.
3. Manage dependencies.

### Step 4: Quality Assurance
1. **Call `test_creator`**: Generate tests for the new code.
2. Run tests. **Fix any failures**. Do not proceed until tests pass.
3. **Call `code_reviewer`** (self-check): Look for "weird artifacts", console logs, commented-out code, or temp files.

### Step 5: Documentation
1. **Call `readme_updater`**: Update the docs.

### Step 6: Cleanup
1. Remove any temporary files created during the process.
2. Ensure file structure is clean.

## Checklist for Success
- [ ] Feature works as requested.
- [ ] UI is beautiful (if applicable).
- [ ] Tests represent the feature logic and pass.
- [ ] README is up to date.
- [ ] No junk left behind.

## Output
- A fully finished feature, ready for deployment.
