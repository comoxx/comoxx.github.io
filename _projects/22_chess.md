---
layout: page
title: A chess LLM under 1M parameters
description: A tiny GPT that plays chess, with a square-level tokenizer to save parameters for the model.
img: assets/img/projects/thumbs/chess.jpg
importance: 5
category: coursework
---

The challenge was to train a transformer that plays legal chess against Stockfish level 1, using one million Lichess games, with **fewer than 1,000,000 parameters**.

I wrote a 72-token tokenizer with one token per square, which leaves almost the whole budget to a 6-layer GPT.

The training data is the `dlouapre/lichess_2025-01_1M` dataset. Each game is a sequence of moves in an extended UCI notation, such as `WPe2e4 BPe7e5 WNg1f3`. The prefix gives the color and the piece, and suffixes mark captures, checks and castling. The model is a small GPT trained on next-token prediction. The course arena checks each generated move against the legal moves of the position. It reports the rate of legal moves and the result of full games against Stockfish level 1.

**Parameter budget**

The template tokenizer gives each possible move its own token, about 1,200 of them. At 128 dimensions, the embedding table alone costs over 150k parameters, before a single transformer layer.

| Tokenizer | Vocabulary | Embedding cost (d = 128) |
|---|---:|---:|
| One token per move | ~1,200 | ~154k |
| **One token per square** | **72** | **~9k** |

Each transformer layer costs about 159k parameters at this width. The vocabulary is the only place where large savings are possible.

**Square-level tokenizer**

A move is a start square and an end square. So `Ng1f3` becomes `⟨g1⟩ ⟨f3⟩`. With the 64 squares, 4 promotion pieces and 4 special tokens, the whole vocabulary fits in 72 tokens. The model has to learn which piece sits where from the context, but it gets almost all of the budget for its layers: 6 layers, 8 heads, 128 dimensions, tied embeddings, **999,030 parameters**.

A regular expression keeps only the squares and the promotion letter. Decoding joins two square tokens, plus an optional promotion token, back into a UCI move such as `e7e8q`. A move therefore takes two or three generation steps instead of one. The arena was updated during the challenge to accept several tokens per move. With the budget fixed, I set the feed-forward width to 361, the largest value that stays under one million.

| Model | Layers × heads × d | Feed-forward width | Parameters |
|---|---|---:|---:|
| chess-legal-comox | 6 × 8 × 128 | 356 | 991,320 |
| chess-legal-comox2 | 6 × 8 × 128 | 361 | 999,030 |

The first version wrote the promotion piece into the destination square (`a8q` as one token). The second keeps promotion as a separate token, which matches the 72-token vocabulary.

Models on Hugging Face: [chess-legal-comox](https://huggingface.co/LLM-course/chess-legal-comox), [chess-legal-comox2](https://huggingface.co/LLM-course/chess-legal-comox2).

*LLM course, Master MVA, 2026.*
