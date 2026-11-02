---
layout: page
title: Threat detection in X-ray scans
description: Finding prohibited items in baggage scans with classical computer vision only. Ranked 4th of 34.
img: assets/img/projects/thumbs/xray.jpg
importance: 9
category: coursework
---

[Kaggle challenge](https://www.kaggle.com/competitions/vic-vision-par-ordinateur-object-detection-in-baggage-using-classic) of the Computer Vision course at CentraleSupélec (2026).

The pipeline reaches a mean IoU of 0.280 on the private leaderboard, 4th of 34 participants.

The task is to detect six classes of prohibited items (hammer, knife, gun, wrench, handcuffs, bullet) in baggage X-ray scans, with no deep learning allowed. The dataset has 4,200 training images with 6,215 annotations. Object sizes vary a lot, from large hammers to small bullets.

**Method**

After a CLAHE contrast step, Selective Search proposes about 3,000 boxes per image. A small gradient boosting model scores each box from 6 cheap features, and only the best 60 boxes go further. These boxes are often loose, so we tighten them with Canny edges. Small boxes are left as they are, so bullets are not damaged.

Each box is then described by HOG, color histograms, LBP texture, edge densities and shape descriptors. Six one-vs-rest gradient boosting classifiers score the box, each with its own confidence threshold tuned on the validation set. Non-maximum suppression runs per class, then across classes.

For training, a proposal counts as a positive if it overlaps a ground-truth box well. It counts as a negative if it overlaps none. Proposals in between were left out, since they would add label noise.

**Results**

The pipeline reaches 0.279 on the validation set, 0.272 on the public leaderboard and 0.280 on the private one, which ranked **4th of 34** participants.

Per-class F1 on the validation set:

| Class | F1 |
|---|---:|
| Hammer | 0.286 |
| Knife | 0.230 |
| Gun | 0.424 |
| Wrench | 0.372 |
| **Handcuffs** | **0.671** |
| Bullet | 0.390 |

Handcuffs are the easiest class, as their shape is distinctive and consistent. Knives are thin, so Selective Search often fails to propose a good box for them. Occluded objects are the main source of misses.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/xray-detection.png" title="Detection" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A correct detection of a wrench.
</div>
