---
name: code_reviewer
description: Reviews code for quality, security, performance, and best practices. Suggests improvements and identifies bugs.
---

# Code Reviewer Skill

This skill ensures that the code written is not just functional, but high-quality, secure, and maintainable.

## 1. Scope
- specific files or the entire changeset of a feature.

## 2. Review Criteria

### Functionality & Logic
- Does the code do what it's supposed to?
- Are there obvious bugs (off-by-one, infinite loops, unchecked nulls)?
- Is error handling present and robust?

### Security
- **Injection**: SQL injection, XSS vulnerabilities?
- **Secrets**: Are API keys coded? (They should be in `.env`).
- **Auth**: Is access control enforced?

### Performance
- **Efficiency**: Are there N+1 queries? Unnecessary loops? heavy re-renders?
- **Resources**: Memory leaks or unclosed file handles?

### Maintainability (Clean Code)
- **Names**: Are variable/function names descriptive?
- **Structure**: Is code modular? DRY (Don't Repeat Yourself)?
- **Style**: Does it recognize project style (indentation, semicolons)?

## 3. Action
- **Refactor**: If you are in "implementation mode", apply the fixes immediately.
- **Report**: If you are in "advisory mode", list the issues and suggested fixes.

## 4. Output
- A list of issues found and/or applied fixes.
