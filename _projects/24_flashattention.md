---
layout: page
title: FlashAttention in Triton
description: Writing the FlashAttention forward pass as a GPU kernel, from online softmax to Triton.
img: assets/img/projects/thumbs/flash.jpg
importance: 7
category: coursework
---

I wrote the FlashAttention forward pass as a Triton kernel, plugged it into PyTorch autograd and benchmarked it against PyTorch's own attention.

This homework reimplements [FlashAttention](https://arxiv.org/abs/2205.14135) (Dao et al., 2022). Attention computes $\mathrm{softmax}(QK^\top/\sqrt{d})\,V$. The naive way stores the full $N \times N$ score matrix in GPU main memory (HBM), which is slow to read and write. FlashAttention never builds it. For each block of queries, it walks over blocks of keys and values and keeps a running row maximum, softmax denominator and output. When the maximum grows, the old sum and output are rescaled. At the end the result is exactly the attention output. Memory stays linear in $N$, and most of the work happens in fast on-chip memory (SRAM).

I built it in three stages. First, an online softmax that reads each row in chunks, and a fused softmax-matmul kernel in Triton. Second, FlashAttention in plain PyTorch. The forward pass uses 16×16 tiles with causal masking and saves the log-sum-exp of each row. The backward pass recomputes the scores block by block with 64×64 blocks, so peak memory grows linearly with the sequence length instead of quadratically.

Third, the forward pass as a Triton GPU kernel with block pointers (`tl.make_block_ptr`). It runs one program per query block and batch element, with 64×64 tiles (16 for short sequences). Key blocks that lie entirely after the query block are skipped under causal masking. The kernel is plugged into PyTorch autograd, and the gradients come from the tiled PyTorch backward.

A benchmark script compares it with PyTorch's `scaled_dot_product_attention` for sequence lengths from 256 to 16,384, with head dimension 64. Forward and backward are timed separately. GPU calls are asynchronous, so the script uses CUDA events and synchronizes before and after each timed loop.

*LLM course, Master MVA, 2026.*
