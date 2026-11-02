---
layout: page
title: PokeLookalike
description: Which first-generation Pokémon do you look like? Face matching that runs entirely in the browser.
img: assets/img/projects/thumbs/pokelookalike.jpg
importance: 1
category: personal
---

A small web app: send a photo and it tells you which of the 151 first-generation Pokémon you look like. **Everything runs in the browser.** The photo is never uploaded or stored, and there is no API route.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pokelookalike-architecture.png" title="Architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Architecture. Each branch scores the 151 candidates, scores are min-max normalized per branch, blended with fixed weights, and turned into percentages by a softmax.
</div>

**Three signals, mixed with fixed weights.**

| Signal | Method | Weight |
|---|---|---|
| Overall look | CLIP ViT-B/32 on the cropped face, cosine against precomputed artwork | 0.55 |
| Face shape | 468 MediaPipe landmarks: roundness, jaw, chin, eye size, matched to each Pokémon's silhouette | 0.37 |
| Colors | Hair and clothes sampled from the landmarks, CIELAB distance to the Pokémon's palette | 0.08 |

**Fairness.** The color weight is kept low on purpose. 35 of the 151 Pokémon are brown, so a color-heavy mix pulls darker skin tones toward brown animals, and the result reads as an insult far more often for some people. When the hair sample is too close to the skin color (shaved head, hair out of frame), the hair channel is dropped. Otherwise color becomes a proxy for skin tone.

**Anti-hubness.** CLIP puts all the official artwork in the same region of its space: the median cosine between two Pokémon is 0.79. Without a fix, a few "hub" Pokémon win whatever the photo. Subtracting the gallery mean on both sides solves it.

**Details.** Close-up portraits fail face detection, so the app retries on padded copies and maps the landmarks back. The gallery is encoded with the same 8-bit quantization as the model the browser loads, so query and gallery go through the same pipeline.
