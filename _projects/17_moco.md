---
layout: page
title: Contrastive learning for Chinese characters
description: MoCo self-supervised learning on 2.9 million images of Chinese characters.
img: assets/img/projects/thumbs/moco.jpg
importance: 12
category: coursework
---

We studied [Momentum Contrast (MoCo)](https://arxiv.org/abs/1911.05722) (He et al., 2020), a self-supervised method. It learns image features by contrast: two views of the same image should look alike, other images should not. Its trick is a long queue of negative examples encoded by a slowly moving "momentum" copy of the network, so the dictionary is both large and consistent.

**Method**

MoCo frames training as a dictionary look-up. An image is augmented twice. One view goes through the query encoder and gives $q$. The other goes through the key encoder and gives the positive key $k_+$. The $K$ negative keys come from a queue of earlier batches. All vectors are L2-normalized, so a dot product is a cosine similarity. The loss is InfoNCE, which is a $(K+1)$-way softmax classification:

$$
\mathcal{L}_q = -\log \frac{\exp(q \cdot k_+ / \tau)}{\sum_{i=0}^{K} \exp(q \cdot k_i / \tau)}
$$

with temperature $\tau = 0.07$. Only the query encoder $\theta_q$ is trained by backpropagation. The key encoder follows it as an exponential moving average:

$$
\theta_k \leftarrow m\, \theta_k + (1 - m)\, \theta_q, \qquad m = 0.999.
$$

The queue is first in, first out. Each new batch of keys is pushed in and the oldest is dropped. This decouples the dictionary size from the batch size, so $K$ can reach 65,536. A slow $m$ keeps the keys in the queue comparable even though they were computed at different steps. The paper also shuffles batch normalization across GPUs for the key encoder. Without it, the network can cheat on the task through batch statistics.

<div class="row justify-content-sm-center">
    <div class="col-sm-9 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/moco-architecture.png" title="MoCo architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    MoCo architecture. The query encoder is trained by backpropagation. The key encoder follows it as a moving average and fills the dictionary queue.
</div>

In the paper's own ablations, which we reviewed, MoCo reaches 60.6% top-1 linear accuracy on ImageNet with ResNet-50. A memory bank gets 58.0% and end-to-end training gets 54.9%. Lowering the momentum from 0.999 to 0.9 drops accuracy from 59.0% to 55.2%, and $m = 0$ does not train at all.

**Our application**

We then applied it to Chinese characters: 6,637 characters rendered in 437 fonts, about 2.9 million images. We trained on 350 fonts and tested on the other 87. Images are 28×28 pixels. This is small for characters with many thin strokes, so some fine details are lost.

The encoder is a small fully connected network (2352 → 512 → 128) with batch norm and ReLU, and an L2-normalized output. We trained it for 200 epochs with SGD (learning rate 0.015, momentum 0.9, batch size 256), $m = 0.999$ and $\tau = 0.07$. Positive pairs are two augmented views of the same character.

To test the features, we fit one Gaussian per character on the training descriptors and classify a test image by the closest cluster in Mahalanobis distance:

$$
D_M(z, \mu) = \sqrt{(z - \mu)^\top \Sigma^{-1} (z - \mu)}.
$$

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

**Results**

| Evaluation of the character encoder | Result |
|---|---:|
| Mahalanobis classifier | 80% accuracy |
| Linear probe on frozen features | 65% accuracy |
| Unseen fonts | 85% accuracy |
| Characters never seen in training | 20% error rate |

The gap between the Mahalanobis classifier and the linear probe shows that the classes are well clustered but not linearly separable. Training with fewer fonts made results worse, so font variety matters. The low error on unseen characters suggests the encoder picked up the sub-components that many characters share. In the t-SNE, a few visually similar characters still overlap.

**Style and content.** For the font encoder, positive pairs share a font but show different characters. Its clusters are less clean, because many fonts look alike. We concatenated both 128-dimensional descriptors and computed the correlation matrix of the 256 dimensions. It shows two diagonal blocks and near-zero correlation between them, so the two encoders capture separate information. Correlations inside the font block are high, which suggests 128 dimensions is more than font style needs.

**Rejection in documents.** On scanned pages, we cut lines and characters with Otsu thresholding and projection profiles. Simple vertical projection fails when characters touch, so we fit the character grid statistically (start position, width, count) with a binomial test on black pixels along the cuts. A CNN then labels each glyph. Since it always outputs some character, we score each prediction with the chi-squared tail of its squared Mahalanobis distance, $P = 1 - F_{\chi^2_k}(D_M^2)$, where $k$ is the feature dimension. Without data augmentation, these scores were poorly calibrated: a comma could get high confidence. With geometric augmentation during training, real characters and other symbols were clearly separated, and a single threshold was enough.

*Deep learning course, Master MVA, 2025. With Abdellah Kahla.*
