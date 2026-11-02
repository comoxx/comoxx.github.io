---
layout: page
title: Counterfactual audio-text learning
description: Reproducing a paper that adds LLM-generated counterfactual captions to CLAP training.
img: assets/img/projects/thumbs/clap.jpg
importance: 6
category: coursework
---

Our full model raises text-to-audio Top-1 retrieval on Clotho from 0.142 to 0.184, and only the factual consistency loss has a visible effect.

[Vosoughi et al. (2024)](https://arxiv.org/abs/2401.04935) teach an audio-text model with counterfactuals: captions an LLM rewrites so that they no longer match the sound. For example, "a few gunshots are fired at the target shooting range" becomes "a few fireworks light up the night sky at shooting range". Two extra losses push the model to tell the true caption from its counterfactual. We reproduced the method with a few changes and checked which claims hold.

**Method**

On top of the usual CLAP contrastive loss, the angle loss is a margin loss. It asks the audio embedding $E_a$ to be closer to the true caption $E_t$ than to the counterfactual $E_{t^*}$:

$$
L_{\text{angle}} = \mathrm{ReLU}\big(\cos(E_a, E_{t^*}) - \cos(E_a, E_t) + m\big).
$$

The factual consistency loss pulls the audio embedding onto its caption, $$L_{\text{factual}} = \lVert E_a - E_t \rVert^2$$.

| | Original paper | Our reproduction |
|---|---|---|
| Audio encoder | PANNs ResNet-38 | pre-trained CLAP (HTS-AT) |
| Training data | several datasets | Clotho only |
| Missing counterfactuals | LLM | rule-based rewrites |
| Angle loss | helps | **almost no effect** |
| Factual consistency loss | helps | **does all the work** |

We used `laion/clap-htsat-fused` with a frozen text encoder and two linear adapters initialized to the identity. We trained on the Clotho development set (about 19,000 pairs) for 3 epochs. Most counterfactuals come from the authors' LLM captions. A 55-word substitution dictionary (gun → piano, gunshot → firework) fills the gaps.

**Results**

Text-to-audio retrieval on the Clotho evaluation set (5,225 queries). The last column counts the queries where the true caption is closer to the audio than the counterfactual.

| Configuration | Top-1 | Top-10 | sim(x,y) > sim(x,y*) |
|---|---:|---:|---:|
| Pre-trained CLAP | 0.142 | 0.506 | 86.0% |
| Fine-tuned, no counterfactual loss | 0.180 | 0.573 | 81.9% |
| + angle loss only | 0.181 | 0.573 | 81.9% |
| + factual loss only | **0.184** | 0.579 | 83.7% |
| Full model | **0.184** | **0.580** | 83.6% |

Plain fine-tuning improves retrieval but makes the model worse at separating true and counterfactual captions, and the factual loss recovers part of that. Zero-shot accuracy on ESC-50 drops from 0.804 to 0.792 with plain fine-tuning, and rises to 0.814 with the full model. Our absolute numbers are higher than the paper's (Top-1 0.184 against 0.126) because the backbone is much stronger.

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

The t-SNE plot shows that the factual loss fully closes the gap between audio and text embeddings.

*Explainable AI course, Master MVA, 2026. With Axel Mauroy and Zhen-Jia Xu.*
