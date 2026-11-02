---
layout: page
title: Histopathology across hospitals
description: Tumor detection on images from an unseen hospital, with a frozen foundation model. Ranked 4th of 45 teams.
img: assets/img/projects/thumbs/histopathology.jpg
importance: 2
category: coursework
---

The task is to classify histopathology patches as tumor or normal. Training, validation and test images come from **different hospitals**. Every center stains, scans and prepares tissue in its own way, and models trained in one place often fail in another.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/histopathology-patches.png" title="Patches from several hospitals" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Normal (top) and tumor (bottom) patches from different centers.
</div>

We tried a lot: general backbones (DINOv2), histopathology foundation models (CTransPath, Phikon, UNI2-h), stain preprocessing, data augmentation, domain adaptation, attention-based multiple instance learning.

The best result came from the simplest setup: **UNI2-h, frozen, with a linear probe on top**, with an accuracy of 98.94% on the public leaderboard and 99.01% on the private one. We finished **4th of 45 teams**, less than 0.001 behind the first. It beat every fine-tuned model and every fancier head. Large-scale pretraining on histopathology data mattered more than the preprocessing and adaptation methods we tried.

*Kaggle challenge, Deep Learning for Medical Imaging, Master MVA, 2026. With Zhen-Jia Xu. In the same course we also reviewed [a MICCAI 2025 paper on coarse-to-fine medical image translation](https://papers.miccai.org/miccai-2025/0157-Paper1774.html) (Tian et al.).*
