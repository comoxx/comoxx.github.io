---
layout: page
title: Threat detection in X-ray scans
description: Finding prohibited items in baggage scans with classical computer vision only. Ranked 4th of 34.
img: assets/img/projects/thumbs/xray.jpg
importance: 9
category: coursework
---

[Kaggle challenge](https://www.kaggle.com/competitions/vic-vision-par-ordinateur-object-detection-in-baggage-using-classic) of the Computer Vision course at CentraleSupélec (2026).

The task: detect six classes of prohibited items (hammer, knife, gun, wrench, handcuffs, bullet) in baggage X-ray scans, with no deep learning allowed. The dataset has 4,200 training images with 6,215 annotations, plus 900 validation and 900 test images. Object sizes vary a lot. A hammer covers 54% of the image width on average, a bullet only 18%.

**Method**

1. **Preprocessing.** CLAHE (clip limit 2.0, 8×8 tiles) evens out the contrast across scanners. A 3×3 Gaussian blur then reduces noise before the gradient-based steps.
2. **Region proposals.** Selective Search (fast mode) gives about 3,000 boxes per image. We keep boxes with $200 < wh < 0.8 \times$ image area and $0.1 < w/h < 10$.
3. **Objectness filter.** A small gradient boosting model scores each box from 6 cheap features: aspect ratio, minimum and mean intensity, maximum and mean Sobel magnitude. Only the top $K = 60$ boxes per image go further.
4. **Box tightening.** Selective Search boxes are loose. Inside each box we compute Canny edges and move each side inward until the edge projection reaches 5% of its maximum. Boxes under 4,000 px² are left as they are, so small bullets are not damaged.
5. **Features.** Each box is resized to 128×128 and described by 8,309 values: HOG (8,100), HSV color histograms (96), a CLAHE intensity histogram (32), LBP texture (26), Canny and Sobel densities on a 4×4 grid (16 each), intensity moments (12) and shape descriptors with Hu moments (11).
6. **Classification.** Six one-vs-rest HistGradientBoosting classifiers, one per class. Each class gets its own confidence threshold, from 0.50 for handcuffs to 0.88 for knives, tuned on the validation set.
7. **Non-maximum suppression.** First per class, then across classes, both with an IoU threshold of 0.15.

Training labels come from the overlap with ground-truth boxes, measured by

$$\text{IoU}(B_1, B_2) = \frac{|B_1 \cap B_2|}{|B_1 \cup B_2|}.$$

A proposal is a positive for class $c$ if its IoU with a box of class $c$ is above 0.45. It is a negative if its IoU with every ground-truth box is below 0.15. Proposals in between are partly on an object and were left out, since they would add label noise.

**Results**

The competition score is a mean IoU. The pipeline reaches 0.279 on the validation set, 0.272 on the public Kaggle leaderboard and 0.280 on the private one, which ranked **4th of 34** participants.

Per-class detection on the validation set (a detection counts if IoU > 0.40):

| Class | Precision | Recall | F1 |
|---|---:|---:|---:|
| Hammer | 0.290 | 0.282 | 0.286 |
| Knife | 0.336 | 0.174 | 0.230 |
| Gun | 0.372 | 0.492 | 0.424 |
| Wrench | 0.377 | 0.368 | 0.372 |
| **Handcuffs** | **0.537** | **0.897** | **0.671** |
| Bullet | 0.490 | 0.324 | 0.390 |
| Mean | 0.400 | 0.423 | 0.396 |

Handcuffs are the easiest class, as their shape is distinctive and consistent. Knives have the lowest recall. They are thin, so Selective Search often fails to propose a good box for them. Bullets suffer from their small size: the features come from very few pixels. When objects overlap, the pipeline confuses them, for instance a wrench detected as handcuffs. Dark objects on a dark background are sometimes dropped by the objectness filter before the classifier sees them.

Keeping 60 proposals is a trade-off. With the full feature vector, it already takes about 0.5 s per image.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/xray-detection.png" title="Detection" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A correct detection of a wrench.
</div>
