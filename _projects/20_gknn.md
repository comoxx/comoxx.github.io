---
layout: page
title: Graph Kernel Neural Networks
description: Studying a GNN that uses graph kernels to go beyond message passing.
img: assets/img/projects/thumbs/gknn.jpg
importance: 14
category: coursework
github: https://github.com/comoxx/GraphKernelNN
---

Geometric data analysis project (Master MVA, 2025), with Paul Rongieras and Zhen-Jia Xu.

On our synthetic cycle task, GKNN stays at chance level while its receptive field is too small, then reaches 100% once the radius is large enough.

Standard graph neural networks pass messages between neighbors. They are no more expressive than the 1-Weisfeiler-Lehman (1-WL) test. They cannot tell apart some graphs that look the same locally, for example one hexagon versus two separate triangles. Graph kernels can, but they are not learned end to end. [Graph Kernel Neural Networks](https://arxiv.org/abs/2112.07436) (Cosmo et al.) redefine graph convolution as a kernel similarity against learnable structural masks.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/gknn-wl.png" title="1-WL failure case" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Every node has two neighbors in both graphs, so message passing sees the same thing. Yet one is a single cycle and the other is two.
</div>

**Method**

A CNN filter computes a dot product between an image patch and a weight tensor. GKNN replaces the patch by the ego-net of radius $r$ around node $v$, the weights by a structural mask, and the dot product by a graph kernel $K$ (by default the Weisfeiler-Lehman kernel):

$$
z_j(v) = K\big(\mathcal{M}_j,\ \mathcal{N}^r_G(v)\big).
$$

A kernel on discrete graphs has no gradient, so each mask is a random graph with learned edge and label probabilities. The layer output becomes an expectation, which the paper estimates by importance sampling around the most likely mask. A second loss term pushes the masks to differ from each other. We wrote out these derivations, then tested the limits of the method on small synthetic datasets with the authors' code.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/gknn-radius.png" title="Receptive field" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The structure a node can see grows with the radius of its neighborhood.
</div>

**Results**

Each dataset has 500 graphs per class, with 40 nodes and the same label on every node. Only the structure can separate the classes.

| Dataset | Radius $r$ | Accuracy |
|---|---:|---:|
| One 40-cycle vs two 20-cycles | 3 | about 50% (validation) |
| One 40-cycle vs two 20-cycles | 5 | about 50% (validation) |
| One 40-cycle vs two 20-cycles | 12 | 100% (validation) |
| One 40-cycle vs a 35-cycle plus a 5-cycle | 7 | 44.5% (test) |

On the first dataset, every ego-net is a simple path for $r < N/4$, so the model guesses at random until the radius can close a cycle. On the second dataset, the 5-cycle is inside the receptive field but covers only 5 nodes out of 40. The learned masks only captured the frequent path-like patterns.

The authors report that one epoch on ZINC is about 36 times slower than with GIN. The method suits small, motif-heavy graphs such as molecules.
