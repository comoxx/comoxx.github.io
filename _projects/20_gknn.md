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

A CNN filter computes a dot product between an image patch and a weight tensor. GKNN replaces the patch by the ego-net $\mathcal{N}^r_G(v)$ (the subgraph of radius $r$ around node $v$), the weights by a structural mask $\mathcal{M}_j$, and the dot product by a graph kernel $K$:

$$
z_j(v) = K\big(\mathcal{M}_j,\ \mathcal{N}^r_G(v)\big).
$$

The default kernel is the Weisfeiler-Lehman kernel. It runs $h$ rounds of WL relabeling and compares the label count vectors $\phi_i$ at each round:

$$
k_{WL}^{(h)}(G, H) = \sum_{i=0}^{h} \langle \phi_i(G), \phi_i(H) \rangle.
$$

A kernel on discrete graphs has no gradient with respect to the adjacency matrix. So each mask is a random graph: edge $e$ exists with probability $\theta_e$, and node $v$ has a label drawn from $\phi_v$. The layer output becomes an expectation, $z_i(v) = \mathbb{E}_{G \sim \mathcal{M}_i}\big[K(G, \mathcal{N}^r_G(v))\big]$. Summing over all graphs is impossible, so the paper uses importance sampling on the set $S$ made of the mode $G^\star$ and its one-edge-flip neighbors:

$$
\hat{z}_i(v) = \frac{|S|}{m} \sum_{k=1}^{m} P_\Theta\big(G^{(k)}\big)\, K\big(G^{(k)}, \mathcal{N}^r_G(v)\big), \qquad G^{(k)} \sim \mathrm{Uniform}(S).
$$

The training loss is $$\mathcal{L} = \mathcal{L}_{CE} + \lambda \mathcal{L}_{JSD}$$. The second term pushes the masks to differ from each other.

We wrote out these derivations, then tested the limits of the method on small synthetic datasets with the authors' code.

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

The first test ("connectivity failure") matches the theory. For $r < N/4$ every ego-net is a simple path, so the model guesses at random. Once the radius is large enough to close a cycle, accuracy jumps to 100%. The second test ("statistical invisibility") is harder. The small 5-cycle is inside the receptive field, but it covers only 5 nodes out of 40. The masks learned the frequent path-like patterns and ignored it.

We also found other limits. The ego-net size grows like $d^r$, so large radii are expensive. In small-world social graphs, ego-nets quickly cover most of the graph as $r$ grows, so all nodes look alike. Training relies on sampling around the mode, which acts like a local search over mask structures. The authors report that one epoch on ZINC is about 36 times slower than with GIN. The method suits small, motif-heavy graphs such as molecules more than large networks.
