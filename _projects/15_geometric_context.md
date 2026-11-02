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

Our best model reaches 83.4% pixel accuracy, and its labels cut the MiDaS depth error (AbsRel) from 0.386 to 0.291.

[Hoiem et al. (ICCV 2005)](https://doi.org/10.1109/ICCV.2005.107) showed that three classes, **ground, vertical and sky**, cover over 97% of an outdoor photo and give a rough idea of its 3D layout. We reproduced their pipeline and measured how much spatial reasoning adds.

**Method**

We used the Hoiem outdoor dataset: 300 images, 50 for training and 250 for testing. About 65% of pixels are vertical, 28% ground and only 7% sky. Each superpixel gets 78 features: color, texture, position and line statistics. The local baseline is AdaBoost with 200 trees. We also reproduced Hoiem's multiple segmentation method (MultiH). It merges superpixels at several scales and averages the label confidences over all regions that contain a superpixel.

To add context, we put a Markov random field on the superpixel adjacency graph. The unary costs are the negative log-probabilities from AdaBoost. The pairwise term is a weighted Potts model: zero for equal labels, and $$\lambda w_{ab}$$ otherwise. Our best weights treat color, texture and position distances separately:

$$
w_{ab} = \exp(-\beta_c d_c - \beta_t d_t - \beta_p d_p).
$$

We implemented min-sum belief propagation (BP) from scratch, in its reparameterization form, and ran 15 forward/backward sweeps. The graph has cycles, so the result is only an approximate MAP.

We also trained a 4-layer graph attention network (GAT) with residual connections. Each node gets the 78 features plus the 3 class probabilities from AdaBoost or MultiH. The loss is class-weighted, and sky gets about 10 times the weight of vertical.

**Results**

Pixel accuracy on the 250 test images.

| Method | Overall | Ground | Vertical | Sky |
|---|---:|---:|---:|---:|
| AdaBoost (local only) | 0.791 | 0.769 | 0.763 | 0.893 |
| MultiH (Hoiem's multiple segmentations) | 0.826 | 0.792 | 0.802 | 0.936 |
| BP, separate weights | 0.823 | 0.790 | 0.820 | 0.880 |
| BP on top of MultiH | 0.827 | 0.846 | 0.724 | 0.901 |
| GNN without attention | 0.798 | 0.666 | 0.815 | 0.812 |
| GNN (GAT) + AdaBoost prior | 0.829 | 0.680 | 0.861 | 0.851 |
| GNN (GAT) + MultiH prior | **0.834** | 0.699 | 0.855 | 0.869 |
| Hoiem et al. 2005 (reported) | 0.860 | | | |

BP gains about 3 points over AdaBoost and removes most of the label flicker. On top of MultiH it adds little, because MultiH already smooths in its own way. The GAT is our best model, while the GNN without attention barely beats AdaBoost. We stay 2.6 points below the paper, which trained on up to 240 images and estimated the horizon per image.

**Depth correction**

Finally, we used the labels to correct the small version of the MiDaS monocular depth model. MiDaS only predicts relative depth, so we first fit a global scale and shift. Then each class $c$ gets its own affine correction, fitted by least squares:

$$
\hat{d}_i = a_c \tilde{d}_i + b_c.
$$

We tested on Make3D (133 images with laser depth), with 5-fold cross-validation. The correction for an image never uses its own ground truth.

| Labels used | AbsRel ↓ | $\delta < 1.25$ ↑ |
|---|---:|---:|
| MiDaS only | 0.386 | 0.475 |
| + AdaBoost labels | 0.330 | 0.537 |
| + BP labels | 0.301 | 0.596 |
| + GNN labels | **0.291** | **0.608** |

Better labels give better depth, in the same order as the classification accuracy. For the GNN labels, the fitted scale is below 1 on ground and above 1 on vertical and sky. The global alignment step still needs some ground-truth depth at test time.

*Graphical models course, Master MVA, 2026. With Paul-Emile Barranger and Guillaume Bernard.*
