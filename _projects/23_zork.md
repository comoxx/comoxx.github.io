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

**Setup**

The games run in Jericho, a Python interface to the Z-machine. Our code is split in two parts. An MCP server (FastMCP) wraps the game and exposes tools. A ReAct agent calls these tools in a loop. At each step the LLM writes a `THOUGHT`, picks a `TOOL` and gives its `ARGS`, and the observation is appended to the context. The LLM was fixed for everyone: Qwen2.5-72B-Instruct through the Hugging Face inference API, at temperature 0 so that runs are reproducible. The final game was kept secret. For practice, the course suggested *Lost Pig*, where points are easier to get.

Grading used a lexicographic order: first the score, then the number of distinct locations visited. Points are rare in these games, so exploring more rooms was the main lever for most students.

**Design**

Our agent relies on four design choices.

1. **Rules before reasoning.** Obvious moves are handled without the LLM. If the room is dark, light the lantern. If there is an item, take it. If the game gives a hint, try it. The LLM (Qwen2.5-72B-Instruct) is only called when nothing obvious is left.
2. **Persistent memory.** Location, score, moves and inventory go into every prompt. Past actions get an importance grade from 0 to 5, so a key discovery stays in context long after a failed command has dropped out.
3. **Loop breaking.** A command that failed in a room is banned there for 8 turns. If the last 6 actions repeat, the prompt tells the model to change its plan.
4. **Fewer, better tools.** The FastMCP server offers `play_action`, `inventory`, `memory`, `get_map` and a tool that reads the rules in a throwaway copy of the game. We dropped the "valid actions" tool. It took 10 to 30 seconds per turn, and learning from a wrong guess was faster.

**Details**

*Memory.* The prompt does not hold the full log of past turns. Each action is graded when it happens. Picking up a new item scores high, a parser error scores 0. The prompt then keeps the most important entries, plus the last few turns in order. This keeps the context short while the important facts stay visible.

*Blacklist.* Failed commands are stored per room, with the turn at which they failed. The prompt lists them under a "blacklisted actions" heading. If the rule layer proposes a command that is still blacklisted, it falls back to `look` instead.

*Stagnation.* The agent also counts turns where the game answers with exactly the same text as before. After 6 such turns, or when the recent actions repeat, the prompt gets a warning and a larger history window. If the agent stays in the same room for 8 turns, it asks for the map (at most once every 10 turns) to find exits it has not tried.

*Map and rules.* `get_map` builds a text graph of the visited rooms and their known exits. It helps in mazes, where room names repeat. The rules tool runs `help`, `info` and `score` in a copy of the game at the start, so these meta-commands do not cost real moves.

**What did not work**

In one 100-step test run on Lost Pig that we logged during development, the agent ended with 2 points. The log shows a clear weakness. The blacklist only matches exact commands. Near the end, the agent tried "use pole to cross stream", then "use pole to bridge stream", then "lay pole across stream" and "place pole across stream". The parser rejected all four. Each one counted as a new command, so the exact-match blacklist never caught them. A check on the meaning of commands, not on their text, would be the next step.

*LLM course, Master MVA, 2026.*
