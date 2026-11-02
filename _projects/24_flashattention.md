---
layout: page
title: FlashAttention in Triton
description: Writing the FlashAttention forward pass as a GPU kernel, from online softmax to Triton.
img: assets/img/projects/thumbs/flash.jpg
importance: 7
category: coursework
---

This homework reimplements [FlashAttention](https://arxiv.org/abs/2205.14135) (Dao et al., 2022). Attention computes $\mathrm{softmax}(QK^\top/\sqrt{d})\,V$. The naive way stores the full $N \times N$ score matrix in GPU main memory (HBM), which is slow to read and write. FlashAttention never builds it.

**Online softmax**

The starting point is a softmax computed in one pass. For a row $x$, a safe softmax subtracts the maximum $m$ before taking exponentials. Reading the row in chunks, we keep a running maximum and a running sum. When a new chunk raises the maximum from $m_{\text{old}}$ to $m_{\text{new}}$, the old sum is rescaled:

$$
\ell \leftarrow e^{m_{\text{old}} - m_{\text{new}}}\,\ell + \sum_{k \in \text{chunk}} e^{x_k - m_{\text{new}}}.
$$

The same trick applies to the product $\mathrm{softmax}(X)\,V$. The partial output is rescaled in the same way, so the softmax and the matrix product fuse into one kernel.

**Forward pass**

For each block of queries $Q_i$, the kernel walks over blocks of keys and values and keeps three running quantities: the row maximum $m_i$, the softmax denominator $\ell_i$ and the output $O_i$.

$$
m_i^{\text{new}} = \max\big(m_i,\ \mathrm{rowmax}(S_{ij})\big), \qquad S_{ij} = Q_i K_j^\top / \sqrt{d}
$$

$$
\ell_i \leftarrow e^{m_i - m_i^{\text{new}}}\,\ell_i + \mathrm{rowsum}\big(e^{S_{ij} - m_i^{\text{new}}}\big), \qquad
O_i \leftarrow e^{m_i - m_i^{\text{new}}}\,O_i + e^{S_{ij} - m_i^{\text{new}}}\,V_j
$$

At the end, $O_i / \ell_i$ is exactly the attention output. Memory stays linear in $N$, and most of the work happens in fast on-chip memory (SRAM). The kernel also stores the log-sum-exp $L_i = m_i + \log \ell_i$ for the backward pass. With causal masking, key blocks that lie entirely after the query block are skipped.

**Backward pass**

The backward pass recomputes the scores block by block instead of storing them. With $D_i = \mathrm{rowsum}(dO_i \circ O_i)$:

$$
P_{ij} = e^{S_{ij} - L_i}, \qquad dV_j \mathrel{+}= P_{ij}^\top dO_i, \qquad dP_{ij} = dO_i V_j^\top,
$$

$$
dS_{ij} = P_{ij} \circ (dP_{ij} - D_i), \qquad dQ_i \mathrel{+}= \frac{dS_{ij} K_j}{\sqrt{d}}, \qquad dK_j \mathrel{+}= \frac{dS_{ij}^\top Q_i}{\sqrt{d}}.
$$

Peak memory is then $O(N \cdot B)$ for a block size $B$, instead of $O(N^2)$.

**What I built**

- **Online softmax**, and a fused softmax-matmul kernel in Triton.
- **FlashAttention in PyTorch**: tiled forward pass (16×16 tiles) with causal masking, saving $L_i$, and the tiled backward pass above (64×64 blocks).
- **FlashAttention in Triton**: the forward pass as a GPU kernel with block pointers (`tl.make_block_ptr`), one program per query block and batch element, with 64×64 tiles (16 for short sequences). It is plugged into PyTorch autograd, and the gradients come from the tiled PyTorch backward. A benchmark script compares it with PyTorch's `scaled_dot_product_attention` for sequence lengths from 256 to 16,384 (head dimension 64, forward and backward timed separately).

For timing, GPU calls are asynchronous. The benchmark uses CUDA events and synchronizes before and after each timed loop.

*LLM course, Master MVA, 2026.*
