---
layout: page
title: Retinal vessel segmentation
description: Segmenting blood vessels in eye fundus images with classical image processing.
img: assets/img/projects/thumbs/retina.jpg
importance: 13
category: coursework
---

Our final pipeline reaches a mean Dice score of 0.737 on the 20 annotated DRIVE images, without any deep learning.

The task is to segment blood vessels in retinal images with classical image processing only. The score is the Dice coefficient between our mask and the manual one, averaged over the images.

**Method**

Vessels are most visible in the green channel, so we enhance it with CLAHE. We then compute three responses. A black top-hat brings out thin dark structures. A matched filter with a Gaussian cross-section is rotated in 12 directions, and we keep the maximum. A Meijering ridge filter works at three scales. Each response is divided by its maximum, then combined with weights found by grid search:

$$R = 0.40\,\widehat{\text{BTH}} + 0.30\,\widehat{\text{MF}} + 0.30\,\widehat{\text{Meij}}.$$

An Isodata threshold on $R$ gives the confident pixels. These act as seeds and grow into weaker neighbors as long as those pass a low threshold. A weak pixel is kept only if it connects to a strong one. Small components are removed at the end.

**Results**

Mean Dice on the 20 images after each step:

| Step | Dice |
|---|---:|
| Baseline: black top-hat + automatic threshold | 0.654 |
| Contrast enhancement (CLAHE) on the green channel | 0.698 |
| Fusion of three filters: top-hat, matched filter, Meijering | 0.721 |
| Hysteresis on high and low confidence pixels | 0.733 |
| **Grow vessels from confident seeds along connected pixels** | **0.737** |
| *(for comparison) random forest on the same features* | *0.736* |

The last gains came from topology, not from better filters. Thin capillaries were found but broken into pieces. Growing them from strong seeds reconnects them. A random forest on the same features did not beat the hand-tuned pipeline.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/retina-pipeline.png" title="Pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The filters and the final segmentation.
</div>

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/retina-result.png" title="Result vs manual annotation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Original image, our segmentation, manual annotation.
</div>

*Image analysis course, CentraleSupélec, 2026. DRIVE dataset.*
