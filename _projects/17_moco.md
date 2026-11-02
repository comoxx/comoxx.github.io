---
layout: page
title: Contrastive learning for Chinese characters
description: MoCo self-supervised learning on 2.9 million images of Chinese characters.
img: assets/img/projects/thumbs/moco.jpg
importance: 12
category: coursework
---

We studied [Momentum Contrast (MoCo)](https://arxiv.org/abs/1911.05722) (He et al., 2020), a self-supervised method. It learns image features by contrast: two views of the same image should look alike, other images should not. Its trick is a long queue of negative examples encoded by a slowly moving "momentum" copy of the network, so the dictionary is both large and consistent.

<div class="row justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/moco-architecture.png" title="MoCo architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    MoCo architecture. The query encoder is trained by backpropagation. The key encoder follows it as a moving average and fills the dictionary queue.
</div>

We then applied it to Chinese characters: 6,637 characters rendered in 437 fonts, about 2.9 million images. We trained on 350 fonts and tested on the other 87.

- The features generalize to **fonts never seen in training**.
- Change the contrastive task (same font, different character) and a second encoder learns **style instead of content**.
- The features make it easy to **reject symbols that are not characters** in real documents.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/moco-tsne.png" title="Character embeddings" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    t-SNE of character embeddings on unseen fonts. Each color is one character.
</div>

*Deep learning course, Master MVA, 2025. With Abdellah Kahla.*
