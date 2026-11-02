---
layout: page
title: Sleep staging from EEG
description: Sleep stages from a five-channel EEG headband, with gradient boosting and an HMM. Ranked 1st of 122 teams.
img: assets/img/projects/thumbs/sleep.jpg
importance: 1
category: coursework
---

Kaggle challenge of the Machine Learning course at CentraleSupélec (Beacon Biosignals, 2025), with Etienne Maugars.

Each 30-second epoch of EEG from the Dreem headband must be labeled Wake, N1, N2, N3 or REM. The metric is macro F1, so the rare N1 stage (6.8% of epochs) counts as much as N2 (44%). Training data covers only 8 subjects.

**Pipeline**

1. **Preprocessing.** Zero-phase Butterworth band-pass (0.5–45 Hz) and a robust normalization based on the interquartile range, which is less sensitive to artifacts.
2. **Features.** 275 per epoch: temporal statistics, band powers (δ, θ, α, σ, β) from Welch spectra, spectral entropy and edge frequency, Hjorth parameters, Katz fractal dimension, permutation entropy, and correlations between channel pairs.
3. **Two models.** A multiclass gradient boosting model, plus a binary model specialized on N1. Their N1 probabilities are blended (weight 0.10 on the specialist, chosen on out-of-fold F1).
4. **Temporal smoothing.** Viterbi decoding with a transition matrix learned from the training nights, since sleep stages follow each other in a structured way.

<div class="row">
    <div class="col-sm-7 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sleep-spectral.png" title="Band powers" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-5 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sleep-hypnogram.png" title="Hypnogram" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: an N3 epoch and its power spectrum split into frequency bands. Right: true and predicted hypnograms for one night.
</div>

**Results**

| Evaluation | Macro F1 |
|---|---:|
| Leave-one-subject-out cross-validation | 0.78 |
| Kaggle public leaderboard | 0.821 |
| Kaggle private leaderboard | 0.800 |

Final ranking: **1st of 122 teams** on the private leaderboard.
