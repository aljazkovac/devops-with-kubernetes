---
allowed-tools: Bash(git checkout:*)
argument-hint: [exerciseNumber, exerciseInstructions]
description: Plan the exercise
model: claude-opus-4-1-20250805
---

# Plan Exercise Command

- Create a new feature branch called `exercise-$1`
- Plan the exercise using the instructions from $2
- Produce and display a TODO list that will be used for the implementation of the exercise
- Do not start implementing anything. Ask for approval of the plan
