---
layout: page
title: An LLM agent for Zork
description: A ReAct agent that plays text adventures through MCP tools, with memory and anti-loop rules.
img: assets/img/projects/thumbs/zork.jpg
importance: 8
category: coursework
---

```
West of House
You are standing in an open field west of a white house.

THOUGHT  The mailbox is the only object here. Open it first.
TOOL     play_action
ARGS     open mailbox
```

<p style="color: var(--global-text-color-light); font-size: 0.85rem;">One turn in the agent's format.</p>

The assignment was to build an LLM agent that plays text adventures such as Zork through MCP tools, and to score as many points as possible in 100 moves. The main difficulties are a strict parser and the tendency of agents to repeat the same actions.

Our agent relies on four design choices.

1. **Rules before reasoning.** Obvious moves are handled without the LLM. If the room is dark, light the lantern. If there is an item, take it. If the game gives a hint, try it. The LLM (Qwen2.5-72B-Instruct) is only called when nothing obvious is left.
2. **Persistent memory.** Location, score, moves and inventory go into every prompt. Past actions get an importance grade from 0 to 5, so a key discovery stays in context long after a failed command has dropped out.
3. **Loop breaking.** A command that failed in a room is banned there for 8 turns. If the last 6 actions repeat, the prompt tells the model to change its plan.
4. **Fewer, better tools.** The FastMCP server offers `play_action`, `inventory`, `memory`, `get_map` and a tool that reads the rules in a throwaway copy of the game. We dropped the "valid actions" tool. It took 10 to 30 seconds per turn, and learning from a wrong guess was faster.

*LLM course, Master MVA, 2026.*
