---
layout: page
title: Threat detection in X-ray scans
description: Finding prohibited items in baggage scans with classical computer vision only. Ranked 4th of 34.
img: assets/img/projects/thumbs/xray.jpg
importance: 9
category: coursework
---

[Kaggle challenge](https://www.kaggle.com/competitions/vic-vision-par-ordinateur-object-detection-in-baggage-using-classic) of the Computer Vision course at CentraleSupélec (2026).

The task: detect six classes of prohibited items in baggage X-ray scans, with no deep learning allowed. The dataset has 4,200 training images with 6,215 annotations.

My pipeline has four stages:

1. **Preprocessing** of the X-ray images.
2. **Region proposals** with Selective Search, filtered by a fast "objectness" classifier (gradient boosting on 6 cheap features). Boxes are then tightened with Canny edges.
3. **Features**: HOG, color, LBP and shape descriptors.
4. **Classification**: one gradient boosting classifier per class, then non-maximum suppression.

The pipeline reaches a mean IoU of 0.279 on the validation set, 0.272 on the public Kaggle leaderboard and 0.280 on the private one, which ranked **4th of 34** participants. Handcuffs are the easiest class (F1 0.67). Occluded objects are the main source of misses.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/xray-detection.png" title="Detection" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A correct detection of a wrench.
</div>
