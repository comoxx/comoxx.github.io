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

We built a ReAct agent that handles obvious moves with fixed rules and only calls the LLM when no rule applies.

An MCP server (FastMCP) wraps the game, and the agent calls its tools in a loop. The LLM was fixed for everyone: Qwen2.5-72B-Instruct at temperature 0. The final game was kept secret, so we practiced on *Lost Pig*. Grading used the score first, then the number of distinct locations visited.

**Design**

The rule layer comes first. If the room is dark, the agent lights the lantern. If there is an item, it takes it. If the game gives a hint, it tries it.

Location, score, moves and inventory go into every prompt. The prompt does not keep the full log. Each action gets an importance grade from 0 to 5 when it happens. Picking up a new item scores high, a parser error scores 0. The prompt keeps the most important entries plus the last few turns, so a key discovery stays visible long after a failed command has dropped out.

To break loops, a command that failed in a room is banned there for 8 turns. If the last 6 actions repeat, the prompt gets a warning and a larger history window. After 8 turns in the same room, the agent asks for the map to find exits it has not tried. This blacklist only matches exact text, so rephrased versions of a failed command still get through.

The map tool builds a text graph of the visited rooms and their known exits, which helps in mazes. We dropped the "valid actions" tool. It took 10 to 30 seconds per turn, and learning from a wrong guess was faster.

*LLM course, Master MVA, 2026.*
