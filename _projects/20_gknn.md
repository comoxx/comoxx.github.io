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

Standard graph neural networks pass messages between neighbors. They cannot tell apart some graphs that look the same locally, for example one hexagon versus two separate triangles. Graph kernels can, but they are not learned end to end. [Graph Kernel Neural Networks](https://arxiv.org/abs/2112.07436) (Cosmo et al.) redefine graph convolution as a kernel similarity against learnable structural masks.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/gknn-wl.png" title="1-WL failure case" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Every node has two neighbors in both graphs, so message passing sees the same thing. Yet one is a single cycle and the other is two.
</div>


We analyzed the method and tested its limits. On a synthetic task, accuracy stays at about 45% while the receptive field is too small to see the whole structure, then jumps to 100% once it is large enough. The method is expressive but slow to train, because the discrete kernels need importance sampling instead of plain gradients. It suits small, motif-heavy graphs such as molecules more than large networks.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/gknn-radius.png" title="Receptive field" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The structure a node can see grows with the radius of its neighborhood.
</div>
