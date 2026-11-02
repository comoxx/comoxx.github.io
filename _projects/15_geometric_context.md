---
layout: page
title: Geometric context from one image
description: Ground, vertical and sky from a single photo, with belief propagation and GNNs, then used to correct depth.
img: assets/img/projects/thumbs/geometric-context.jpg
importance: 11
category: coursework
---

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/grm-strip.png" title="Geometric labels" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Photo, local labels, labels with context. Sky in blue, vertical in red, ground in green.
</div>

[Hoiem et al. (ICCV 2005)](https://doi.org/10.1109/ICCV.2005.107) showed that three classes, **ground, vertical and sky**, cover over 97% of an outdoor photo and give a rough idea of its 3D layout. We reproduced their pipeline and measured how much spatial reasoning adds.

| Method | Accuracy |
|---|---:|
| Superpixels + AdaBoost (local only) | 0.791 |
| + belief propagation | 0.823 |
| Multiple segmentations (Hoiem's MultiH) | 0.825 |
| MultiH + belief propagation | 0.827 |

Belief propagation on a Markov random field over superpixels gains 3 points and removes most of the label flicker. On top of MultiH it adds little, because MultiH already smooths in its own way. We also tried a graph neural network that learns its own message passing. Finally, we used the labels to correct the class-dependent bias of the MiDaS monocular depth model.

*Graphical models course, Master MVA, 2026. With Paul-Emile Barranger and Guillaume Bernard.*
