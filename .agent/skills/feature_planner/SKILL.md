---
name: feature_planner
description: Creates a comprehensive step-by-step plan for implementing a specific feature, including file changes, dependencies, and verification steps.
---

# Feature Planner Skill

This skill is designed to take a high-level feature request and break it down into a concrete, actionable implementation plan.

## 1. Understand the Goal
- Read the user's feature request carefully.
- Identify the core value proposition and the specific requirements.
- Determine the scope: Is this a frontend change, backend API, database schema change, or a mix?

## 2. Analyze the Existing Codebase
- Use `list_dir` and `view_file_outline` to understand the current project structure.
- specific files that will need to be touched.
- Identify where new files should be placed based on existing patterns (e.g., components in `/components`, utils in `/utils`).

## 3. Develop the Implementation Plan
Create a numbered list of steps. Each step should be atomic and clear.

### Format for the Plan:

**Phase 1: Setup & Dependencies**
- [ ] Install necessary packages (if any).
- [ ] Create directory structures.

**Phase 2: Core Logic / Backend**
- [ ] Create/Update data models.
- [ ] Implement API endpoints or logic functions.

**Phase 3: UI / Frontend (if applicable)**
- [ ] Create necessary components.
- [ ] Integrate with the logic/backend.
- [ ] styling and responsiveness.

**Phase 4: Integration & wiring**
- [ ] Add routes or entry points.
- [ ] Connect the new feature to the rest of the application.

## 4. Verification Strategy
- Define how we will verify the feature works.
- List specific manual test steps the user can perform.

## 5. Output
- Present the plan to the user for approval before writing any code.
- Ask: "Does this plan look correct to you?"
