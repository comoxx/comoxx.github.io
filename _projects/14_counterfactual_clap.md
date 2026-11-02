---
layout: page
title: Counterfactual audio-text learning
description: Reproducing a paper that adds LLM-generated counterfactual captions to CLAP training.
img: assets/img/projects/thumbs/clap.jpg
importance: 6
category: coursework
---

[Vosoughi et al. (2024)](https://arxiv.org/abs/2401.04935) teach an audio-text model with counterfactuals: captions an LLM rewrites so that they no longer match the sound. Two extra losses push the model to tell the true caption from its counterfactual. We reproduced the method with a few changes and checked which claims hold.

| | Original paper | Our reproduction |
|---|---|---|
| Audio encoder | PANNs ResNet-38 | pre-trained CLAP (HTS-AT) |
| Training data | several datasets | Clotho only |
| Missing counterfactuals | LLM | rule-based rewrites |
| Angle loss | helps | **almost no effect** |
| Factual consistency loss | helps | **does all the work** |

With a strong backbone, the factual consistency loss is the one that matters. It lifts text-to-audio Top-1 retrieval on Clotho from **0.142 to 0.184**, raises zero-shot ESC-50 accuracy from 0.804 to 0.814, and fully closes the gap between audio and text embeddings.

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

*Explainable AI course, Master MVA, 2026. With Axel Mauroy and Zhen-Jia Xu.*
