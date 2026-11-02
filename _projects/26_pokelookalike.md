---
layout: page
title: PokeLookalike
description: Which first-generation Pokémon do you look like? Face matching that runs entirely in the browser.
img: assets/img/projects/thumbs/pokelookalike.jpg
importance: 1
category: personal
---

A small web app: send a photo and it tells you which of the 151 first-generation Pokémon you look like. **Everything runs in the browser.** The photo is never uploaded or stored, and there is no API route.

I built it around three scores for each Pokémon, one from CLIP, one from face shape and one from colors.

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

MediaPipe finds the face and its landmarks, and CLIP embeds a padded crop with transformers.js. The artwork embeddings, palettes and silhouettes are computed offline and shipped as static files. Close-up portraits fail face detection, so the app retries on padded copies and maps the landmarks back.

For face shape, PokéAPI puts every species in one of 14 body shapes. I wrote a prototype face for each shape by hand. A round face with big eyes reads as "ball", a long narrow face as "squiggle".

CLIP puts all the official artwork in the same region of its space. The median cosine between two Pokémon is 0.79, so a few "hub" Pokémon won whatever the photo. Subtracting the gallery mean from both the face and the artwork embeddings fixed it.

Each score is min-max normalized over the 151 candidates, then blended and turned into percentages:

$$
b_i = 0.55\, \hat{s}^{\text{clip}}_i + 0.37\, \hat{s}^{\text{geo}}_i + 0.08\, \hat{s}^{\text{col}}_i, \qquad p_i = \frac{\exp(b_i / T)}{\sum_j \exp(b_j / T)}, \quad T = 0.045.
$$

I tuned the weights and the temperature by hand on a `/tune` page that recomputes the top 3 live. At $$T = 0.12$$ the top three all landed around 6%, which looked like no answer at all.

**Fairness**

The color weight is kept low on purpose. 35 of the 151 Pokémon are brown, so a color-heavy mix pulls darker skin tones toward brown animals. When the hair sample is too close to the skin color, for example with a shaved head, the hair channel is dropped. Otherwise color becomes a proxy for skin tone.

The stack is Next.js, transformers.js, MediaPipe Tasks Vision and Tailwind, with data and artwork from PokéAPI.
