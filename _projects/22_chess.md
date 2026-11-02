---
layout: page
title: A chess LLM under 1M parameters
description: A tiny GPT that plays chess, with a square-level tokenizer to save parameters for the model.
img: assets/img/projects/thumbs/chess.jpg
importance: 5
category: coursework
---

The challenge was to train a transformer that plays legal chess against Stockfish level 1, using one million Lichess games, with **fewer than 1,000,000 parameters**.

**Task**

The training data is the `dlouapre/lichess_2025-01_1M` dataset. Each game is a sequence of moves in an extended UCI notation, such as `WPe2e4 BPe7e5 WNg1f3`. The prefix gives the color and the piece, and suffixes mark captures, checks and castling. The model is a small GPT trained on next-token prediction. For a game tokenized as $x_1, \dots, x_T$, the loss is the usual cross-entropy:

$$
\mathcal{L}(\theta) = -\frac{1}{T} \sum_{t=1}^{T} \log p_\theta(x_t \mid x_{<t}).
$$

At play time, the model reads the game so far and generates the next move. The course arena checks the move against the legal moves of the position. It reports two things: the rate of legal moves, and the result of full games against Stockfish level 1.

### Parameter budget

The template tokenizer gives each possible move its own token, about 1,200 of them. At 128 dimensions, the embedding table alone costs over 150k parameters, before a single transformer layer.

| Tokenizer | Vocabulary | Embedding cost (d = 128) |
|---|---:|---:|
| One token per move | ~1,200 | ~154k |
| **One token per square** | **72** | **~9k** |

For a GPT with vocabulary $V$, width $d$, context $n_{\text{ctx}}$, $L$ layers and a feed-forward width $d_{\text{ff}}$, with tied input and output embeddings, the count is:

$$
N = V d + n_{\text{ctx}} d + L \left( 4d^2 + 2 d\, d_{\text{ff}} + 9d + d_{\text{ff}} \right) + 2d.
$$

The $4d^2$ term covers the query, key, value and output projections. The $2 d\, d_{\text{ff}}$ term is the MLP. The rest are biases and layer norms. With $V = 72$, $d = 128$, $n_{\text{ctx}} = 256$ and $L = 6$, every layer costs about 159k parameters. So the vocabulary is the only place where large savings are possible.

### Square-level tokenizer

A move is a start square and an end square. So `Ng1f3` becomes `⟨g1⟩ ⟨f3⟩`. With the 64 squares, 4 promotion pieces and 4 special tokens, the whole vocabulary fits in 72 tokens. The model has to learn which piece sits where from the context, but it gets almost all of the budget for its layers: 6 layers, 8 heads, 128 dimensions, tied embeddings, **999,030 parameters**.

The tokenizer drops the color, the piece letter and the capture or check suffixes. A regular expression keeps only the squares and the promotion letter. Decoding goes the other way: two square tokens, plus an optional promotion token, are joined back into a UCI move such as `e7e8q`. A move therefore takes two or three generation steps instead of one. The arena was updated during the challenge to accept several tokens per move.

With the budget fixed, the feed-forward width was the last free knob. $d_{\text{ff}} = 361$ is the largest value that keeps the total under one million. One more unit per layer would add 1,542 parameters and cross the limit.

**Submitted models**

| Model | Vocabulary | Layers × heads × d | $d_{\text{ff}}$ | Parameters |
|---|---:|---|---:|---:|
| chess-legal-comox | 72 | 6 × 8 × 128 | 356 | 991,320 |
| chess-legal-comox2 | 72 | 6 × 8 × 128 | 361 | 999,030 |

Both use a 256-token context and dropout 0.1. The first version wrote the promotion piece into the destination square (`a8q` as one token). The second one keeps promotion as a separate token, which matches the 72-token vocabulary of the model.

Models on Hugging Face: [chess-legal-comox](https://huggingface.co/LLM-course/chess-legal-comox), [chess-legal-comox2](https://huggingface.co/LLM-course/chess-legal-comox2).

*LLM course, Master MVA, 2026.*
