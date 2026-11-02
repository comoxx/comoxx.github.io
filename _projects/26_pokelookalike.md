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

**Pipeline.** MediaPipe Face Landmarker finds the face and its 468 landmarks. The app keeps the largest face, measures it, samples colors around it and cuts a padded square crop. CLIP embeds the crop with transformers.js, on WebGPU when the browser has it and on WebAssembly otherwise. The 151 artwork embeddings, palettes and silhouettes are computed offline and shipped as static files.

**Overall look.** Let $x$ be the CLIP embedding of the face and $g_i$ the embedding of Pokémon $i$. Both are centered with the gallery mean $\bar{g}$ and re-normalized before the cosine (see anti-hubness below):

$$
s^{\text{clip}}_i = \frac{(x - \bar{g}) \cdot (g_i - \bar{g})}{\lVert x - \bar{g} \rVert \, \lVert g_i - \bar{g} \rVert}.
$$

**Face shape.** PokéAPI puts every species in one of 14 body shapes (ball, squiggle, armor, and so on). I wrote a prototype face for each shape by hand, with four measurements: aspect ratio, jaw roundness, chin angle and eye size. The affinity is a Gaussian score, averaged over the four features $f$:

$$
s^{\text{geo}}_i = \exp\left( -\frac{1}{8} \sum_{f} \left( \frac{m_f - p_{i,f}}{\sigma_f} \right)^2 \right),
$$

where $m_f$ is the measured value, $p_{i,f}$ the prototype of the species' shape and $\sigma_f$ a fixed spread per feature. This is the least principled part of the app. A round face with big eyes reads as "ball", a long narrow face as "squiggle".

**Colors.** Each artwork gets a palette of 4 dominant colors (k-means on a 48×48 thumbnail, transparent pixels ignored). Colors are compared in CIELAB, where Euclidean distance $\Delta E$ follows perceived difference better than RGB. A similarity of $\max(0, 1 - \Delta E / 60)$ turns it into a score between 0 and 1. Hair counts for half of the color score, clothes and the species' main color for a quarter each.

**Blending.** Each signal lives on its own scale, so each one is min-max normalized over the 151 candidates first. The blended score and the displayed percentage are:

$$
b_i = 0.55\, \hat{s}^{\text{clip}}_i + 0.37\, \hat{s}^{\text{geo}}_i + 0.08\, \hat{s}^{\text{col}}_i, \qquad p_i = \frac{\exp(b_i / T)}{\sum_j \exp(b_j / T)}, \quad T = 0.045.
$$

The temperature was tuned by eye. At $T = 0.12$ the top three all landed around 6%, and the result read as "no idea".

**Fairness.** The color weight is kept low on purpose. 35 of the 151 Pokémon are brown, so a color-heavy mix pulls darker skin tones toward brown animals, and the result reads as an insult far more often for some people. When the hair sample is too close to the skin color (shaved head, hair out of frame), the hair channel is dropped. Otherwise color becomes a proxy for skin tone. In practice the threshold is a CIELAB distance of 18 between the hair and skin samples.

**Anti-hubness.** CLIP puts all the official artwork in the same region of its space: the median cosine between two Pokémon is 0.79. Without a fix, a few "hub" Pokémon win whatever the photo. Subtracting the gallery mean on both sides solves it.

**Details.** Close-up portraits fail face detection, so the app retries on padded copies and maps the landmarks back. The gallery is encoded with the same 8-bit quantization as the model the browser loads, so query and gallery go through the same pipeline.

The padded copies are letterboxed at 1.6× and then 2.5× the original size. The quantized CLIP model weighs about 90 MB and is cached by the browser after the first visit. MediaPipe adds about 22 MB of WebAssembly and a 3.6 MB model, served from the site itself. A `/tune` page loads several photos, runs the models once per photo and recomputes the top 3 live while the weights move. The weights above were tuned there, by hand. There is no ground truth for "who looks like which Pokémon", so there is no accuracy number. An end-to-end Playwright test drives the real flow on two portraits and checks that a photo without a face returns an error.

**Stack.** Next.js, transformers.js, MediaPipe Tasks Vision, Tailwind. Offline scripts use sharp for the artwork. Data and artwork come from PokéAPI.
