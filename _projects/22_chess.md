---
layout: page
title: A chess LLM under 1M parameters
description: A tiny GPT that plays chess, with a square-level tokenizer to save parameters for the model.
img: assets/img/projects/thumbs/chess.jpg
importance: 5
category: coursework
---

The challenge was to train a transformer that plays legal chess against Stockfish level 1, using one million Lichess games, with **fewer than 1,000,000 parameters**.

### Parameter budget

The template tokenizer gives each possible move its own token, about 1,200 of them. At 128 dimensions, the embedding table alone costs over 150k parameters, before a single transformer layer.

| Tokenizer | Vocabulary | Embedding cost (d = 128) |
|---|---:|---:|
| One token per move | ~1,200 | ~154k |
| **One token per square** | **72** | **~9k** |

### Square-level tokenizer

A move is a start square and an end square. So `Ng1f3` becomes `⟨g1⟩ ⟨f3⟩`. With the 64 squares, 4 promotion pieces and 4 special tokens, the whole vocabulary fits in 72 tokens. The model has to learn which piece sits where from the context, but it gets almost all of the budget for its layers: 6 layers, 8 heads, 128 dimensions, tied embeddings, **999,030 parameters**.

Models on Hugging Face: [chess-legal-comox](https://huggingface.co/LLM-course/chess-legal-comox), [chess-legal-comox2](https://huggingface.co/LLM-course/chess-legal-comox2).

*LLM course, Master MVA, 2026.*
