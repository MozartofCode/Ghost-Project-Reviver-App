---
name: readme_updater
description: Updates the project README to reflect new features, usage instructions, or configuration changes, ensuring documentation stays valid.
---

# README Updater Skill

Documentation is as important as code. This skill ensures the `README.md` evolves with the project.

## 1. Context Gathering
- Read the existing `README.md`.
- Analyze the recently implemented features or changes.
- Identify what information is missing (e.g., new environment variables, new scripts, new API endpoints).

## 2. Structure of a Good README
Ensure the README contains:
- **Project Title & Description**: Clear and concise.
- **Features**: A list of key capabilities.
- **Installation**: Steps to get started.
- **Usage**: content on how to use the app.
- **Configuration**: Environment variables (.env).
- **Tech Stack**: Technologies used.

## 3. Execution
1. Open `README.md`.
2. Insert new sections or update existing ones.
   - *Example*: If a new API route `/api/status` was added, add it to the API documentation section.
   - *Example*: If `CLAUDE_API_KEY` is now required, add it to the 'Environment Variables' section.
3. Check for formatting inconsistencies (indentation, markdown syntax).

## 4. Verification
- Preview the markdown to ensure it renders correctly (mentally check syntax).
- Ensure no sensitive data (real keys) is written to the README.
- **Strictly** avoid removing existing useful information unless it is obsolete.

## Output
- A modified `README.md` file.
