---
layout: page
title: FlashAttention in Triton
description: Writing the FlashAttention forward pass as a GPU kernel, from online softmax to Triton.
img: assets/img/projects/thumbs/flash.jpg
importance: 7
category: coursework
---

This homework reimplements [FlashAttention](https://arxiv.org/abs/2205.14135) (Dao et al., 2022). Attention computes $\mathrm{softmax}(QK^\top/\sqrt{d})\,V$. The naive way stores the full $N \times N$ score matrix. FlashAttention never builds it. For each block of queries $Q_i$, it walks over blocks of keys and values and keeps three running quantities: the row maximum $m_i$, the softmax denominator $\ell_i$ and the output $O_i$.

$$
m_i^{\text{new}} = \max\big(m_i,\ \mathrm{rowmax}(S_{ij})\big), \qquad S_{ij} = Q_i K_j^\top / \sqrt{d}
$$

$$
\ell_i \leftarrow e^{m_i - m_i^{\text{new}}}\,\ell_i + \mathrm{rowsum}\big(e^{S_{ij} - m_i^{\text{new}}}\big), \qquad
O_i \leftarrow e^{m_i - m_i^{\text{new}}}\,O_i + e^{S_{ij} - m_i^{\text{new}}}\,V_j
$$

At the end, $O_i / \ell_i$ is exactly the attention output. Memory stays linear in $N$, and most of the work happens in fast on-chip memory.

I built it in three stages:

- **Online softmax**, and a fused softmax-matmul.
- **FlashAttention in PyTorch**: tiled forward pass with causal masking, saving $\log \ell_i + m_i$ for the backward pass, and the backward formulas for $dQ$, $dK$, $dV$.
- **FlashAttention in Triton**: the forward pass as a GPU kernel with block pointers, plugged into PyTorch autograd and benchmarked against `scaled_dot_product_attention`.

*LLM course, Master MVA, 2026.*
