# Agent Instructions

This is the main shared instruction file for Codex, Claude Code, OpenCode, and other coding agents working in this repository.

## Before Work

Before substantial work, read:

- `AGENTS.md`
- `STATUS.md`
- `DECISIONS.md`
- `TODO.md`

Inspect the repository before making assumptions. Treat information marked `TBD` as unknown rather than settled.

## Working Guidelines

- Make the smallest correct change that satisfies the task.
- Preserve existing behavior unless a change is intentional and documented.
- Do not invent project requirements, commands, architecture, or supported environments.
- Follow established repository patterns once they exist.
- Keep documentation concise and avoid repeating information across files.
- Add or update tests for behavior changes when a test framework exists.
- Run relevant checks when available and report checks that could not be run.
- Do not commit secrets, credentials, generated artifacts, or local environment files.
- Do not revert unrelated user or agent changes.

## After Work

After substantial work, update documentation when relevant:

- `STATUS.md`: current working state, in-progress work, known issues, and the immediate next step.
- `DECISIONS.md`: durable technical or architectural decisions and their rationale.
- `TODO.md`: add, complete, remove, or reprioritize pending work.
- `README.md`: user-facing setup, usage, build, and test instructions.

Keep status notes current rather than maintaining a detailed change log.
