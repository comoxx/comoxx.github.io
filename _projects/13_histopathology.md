---
layout: page
title: Histopathology across hospitals
description: Tumor detection on images from an unseen hospital, with a frozen foundation model. Ranked 4th of 45 teams.
img: assets/img/projects/thumbs/histopathology.jpg
importance: 2
category: coursework
---

A frozen UNI2-h with a linear probe reached 99.01% accuracy on the private leaderboard, which placed us 4th of 45 teams.

The task is to classify histopathology patches as tumor or normal. Training, validation and test images come from **different hospitals**. Every center stains, scans and prepares tissue in its own way, and models trained in one place often fail in another.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/histopathology-patches.png" title="Patches from several hospitals" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Normal (top) and tumor (bottom) patches from different centers.
</div>

**Method**

The patches are 224×224 pixels and the classes are balanced. About 100,000 training patches come from three centers. The validation set (34,904 patches) and the test set (85,054 patches) each come from a center never seen in training. In a 2D projection of the images, patches group by center more than by class.

We tried a lot: general backbones (DINOv2), histopathology foundation models (CTransPath, Phikon, UNI2-h), stain preprocessing, data augmentation, domain adaptation, attention-based multiple instance learning.

Our final model keeps UNI2-h frozen and trains a single linear layer on its features. A grid search picked SGD, learning rate $2 \times 10^{-4}$, batch size 8 and 10 epochs. Smaller batches generalized better. We then tuned the decision threshold on the validation center and applied it unchanged to the test set.

**Results**

Test accuracy on the Kaggle public leaderboard.

| Backbone | Head | Test accuracy |
|---|---|---:|
| DINOv2 (provided baseline) | Linear | 0.9060 |
| DINOv2, fine-tuned | MLP | 0.9509 |
| CTransPath | Linear | 0.9522 |
| DINOv2, fine-tuned | Linear | 0.9687 |
| Phikon | Linear | 0.9749 |
| UNI2-h | Attention MIL | 0.9881 |
| UNI2-h | Linear + tuned threshold | **0.9894** |

The simplest setup beat every fine-tuned model and every fancier head. It reached 98.94% on the public leaderboard and 99.01% on the private one, less than 0.001 behind the first team. Threshold tuning alone moved the test accuracy from 98.87% to 98.94%. Large-scale pretraining on histopathology data mattered more than the preprocessing and adaptation methods we tried. UNI2-h does not publish its full pretraining data, so some challenge images may have been seen in pretraining.

*Kaggle challenge, Deep Learning for Medical Imaging, Master MVA, 2026. With Zhen-Jia Xu. In the same course we also reviewed [a MICCAI 2025 paper on coarse-to-fine medical image translation](https://papers.miccai.org/miccai-2025/0157-Paper1774.html) (Tian et al.).*
