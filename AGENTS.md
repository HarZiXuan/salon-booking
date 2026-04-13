# Agent Instructions: Superpowers

This project uses the **Superpowers** agentic skills framework.

## ⚡ Initial Action: Establish Skills
At the start of every session, you MUST:
1.  Read and follow the `using-superpowers` skill located at `.agents/skills/using-superpowers/SKILL.md`.
2.  Check for other relevant skills in `.agents/skills/` before performing ANY action or response.

## 🧠 Core Philosophy
- **Planning First**: Use the `brainstorming` skill before writing any implementation code.
- **Strict TDD**: Follow the `test-driven-development` skill for all new features and bug fixes.
- **Systematic Debugging**: Use the `systematic-debugging` skill for investigating issues.
- **Your Human Partner**: Always treat the user as your senior engineering partner. Communicate your plan and get sign-off before execution.

## 🛠️ Tool Usage
- Use the `view_file` tool to read `SKILL.md` files.
- Follow the workflows defined in the skills exactly. Do not skip steps.
