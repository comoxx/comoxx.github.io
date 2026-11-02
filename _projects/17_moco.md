---
layout: page
title: Contrastive learning for Chinese characters
description: MoCo self-supervised learning on 2.9 million images of Chinese characters.
img: assets/img/projects/thumbs/moco.jpg
importance: 12
category: coursework
---

We studied [Momentum Contrast (MoCo)](https://arxiv.org/abs/1911.05722) (He et al., 2020), a self-supervised method. It learns image features by contrast: two views of the same image should look alike, other images should not. Its trick is a long queue of negative examples encoded by a slowly moving "momentum" copy of the network, so the dictionary is both large and consistent.

Our character encoder reaches 85% accuracy on fonts it never saw during training.

<div class="row justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/moco-architecture.png" title="MoCo architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    MoCo architecture. The query encoder is trained by backpropagation. The key encoder follows it as a moving average and fills the dictionary queue.
</div>

**Our application**

We applied MoCo to Chinese characters: 6,637 characters rendered in 437 fonts, about 2.9 million images. We trained on 350 fonts and tested on the other 87. Images are 28×28 pixels, so some thin strokes are lost.

The encoder is a small fully connected network (2352 → 512 → 128) with batch norm, ReLU and an L2-normalized output. Positive pairs are two augmented views of the same character. We trained for 200 epochs with SGD, a momentum of 0.999 for the key encoder and a temperature of 0.07. To test the features, we fit one Gaussian per character on the training descriptors. A test image gets the label of the closest cluster in Mahalanobis distance.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/moco-tsne.png" title="Character embeddings" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    t-SNE of character embeddings on unseen fonts. Each color is one character.
</div>

**Results**

| Evaluation of the character encoder | Result |
|---|---:|
| Mahalanobis classifier | 80% accuracy |
| Linear probe on frozen features | 65% accuracy |
| Unseen fonts | 85% accuracy |
| Characters never seen in training | 20% error rate |

The classes are well clustered but not linearly separable, which explains the gap with the linear probe. Training on fewer fonts made the results worse, so font variety matters.

We also trained a second encoder where positive pairs share a font but show different characters. It learns style instead of content. The correlation matrix of the two concatenated descriptors shows two separate blocks, so the encoders capture different information.

Finally, we used the features to reject symbols that are not characters in scanned documents. A CNN labels each cut glyph, and we score its prediction with the Mahalanobis distance to the predicted cluster. With geometric augmentation during training, a single threshold was enough to separate real characters from commas and other symbols.

*Deep learning course, Master MVA, 2025. With Abdellah Kahla.*
