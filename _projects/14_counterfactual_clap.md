---
layout: page
title: Counterfactual audio-text learning
description: Reproducing a paper that adds LLM-generated counterfactual captions to CLAP training.
img: assets/img/projects/thumbs/clap.jpg
importance: 6
category: coursework
---

[Vosoughi et al. (2024)](https://arxiv.org/abs/2401.04935) teach an audio-text model with counterfactuals: captions an LLM rewrites so that they no longer match the sound. For example, "a few gunshots are fired at the target shooting range" becomes "a few fireworks light up the night sky at shooting range". Two extra losses push the model to tell the true caption from its counterfactual. We reproduced the method with a few changes and checked which claims hold.

**Method**

Let $E_a$ be the audio embedding, $E_t$ the embedding of the true caption and $E_{t^*}$ the embedding of the counterfactual. The total loss is

$$
L_{\text{total}} = L_{\text{CLAP}} + w_1 L_{\text{angle}} + w_2 L_{\text{factual}}.
$$

$L_{\text{CLAP}}$ is the usual symmetric InfoNCE loss on the batch similarity matrix. The angle loss is a margin loss that asks the audio to be closer to the true caption than to the counterfactual:

$$
L_{\text{angle}} = \mathrm{ReLU}\big(\cos(E_a, E_{t^*}) - \cos(E_a, E_t) + m\big).
$$

The factual consistency loss pulls the audio embedding onto its caption, $L_{\text{factual}} = \lVert E_a - E_t \rVert^2$.

| | Original paper | Our reproduction |
|---|---|---|
| Audio encoder | PANNs ResNet-38 | pre-trained CLAP (HTS-AT) |
| Training data | several datasets | Clotho only |
| Missing counterfactuals | LLM | rule-based rewrites |
| Angle loss | helps | **almost no effect** |
| Factual consistency loss | helps | **does all the work** |

We used `laion/clap-htsat-fused` with a frozen text encoder and two linear adapters initialized to the identity. We trained on the Clotho development set (about 19,000 pairs) for 3 epochs, with AdamW, learning rate $10^{-5}$, batch size 32, $m = 0.1$, $w_1 = 1$ and $w_2 = 100$. Most counterfactuals come from the authors' LLM captions. A 55-word substitution dictionary (gun → piano, gunshot → firework) fills the gaps.

**Results**

Text-to-audio retrieval on the Clotho evaluation set (5,225 queries). The last column counts the queries where the true caption is closer to the audio than the counterfactual.

| Configuration | $w_1$ | $w_2$ | Top-1 | Top-10 | sim(x,y) > sim(x,y*) |
|---|---:|---:|---:|---:|---:|
| Pre-trained CLAP | | | 0.142 | 0.506 | 86.0% |
| Fine-tuned, no counterfactual loss | 0 | 0 | 0.180 | 0.573 | 81.9% |
| + angle loss only | 1 | 0 | 0.181 | 0.573 | 81.9% |
| + factual loss only | 0 | 100 | **0.184** | 0.579 | 83.7% |
| Full model | 1 | 100 | **0.184** | **0.580** | 83.6% |

Plain fine-tuning improves retrieval but makes the model worse at separating true and counterfactual captions. The angle loss alone changes nothing. The factual loss recovers part of that ability and gives the best Top-1. Zero-shot accuracy on ESC-50 drops from 0.804 to 0.792 with plain fine-tuning, and rises to 0.814 with the full model. Audio-to-text Recall@1 goes from 0.183 to 0.222.

A sweep over $w_2$ with $w_1 = 1$ gave the best Top-1 at $w_2 = 500$ (0.185). At $w_2 = 1000$ the squared error term dominates and Top-10 falls to 0.567. Our absolute numbers are higher than the paper's (Top-1 0.184 against 0.126) because the backbone is much stronger. The relative pattern is the same.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/xai-tsne.png" title="Embeddings before and after" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/xai-recall.png" title="Recall@k" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: audio and text embeddings before and after fine-tuning. Right: text-to-audio recall@k.
</div>

The t-SNE plot shows that the factual loss fully closes the gap between audio and text embeddings. Most remaining retrieval errors are within one sound category (two bird recordings, two coin recordings). The rule-based rewrites are sometimes absurd ("adults and children are chirping"), which weakens the training signal.

*Explainable AI course, Master MVA, 2026. With Axel Mauroy and Zhen-Jia Xu.*
