---
layout: page
title: Sleep staging from EEG
description: Sleep stages from a five-channel EEG headband, with gradient boosting and an HMM. Ranked 1st of 122 teams.
img: assets/img/projects/thumbs/sleep.jpg
importance: 1
category: coursework
---

Kaggle challenge of the Machine Learning course at CentraleSupélec (Beacon Biosignals, 2025), with Etienne Maugars.

Our final model reaches a macro F1 of 0.800 on the private leaderboard, first of 122 teams.

Each 30-second epoch of EEG from the Dreem headband (5 channels, 100 Hz) must be labeled Wake, N1, N2, N3 or REM. Training data covers only 8 subjects, one night each, for 7,433 epochs. The metric is macro F1, so the rare N1 stage (6.8% of epochs) counts as much as N2 (44%).

**Method**

We first band-pass the signals between 0.5 and 45 Hz with a zero-phase Butterworth filter. Each channel is then normalized with the median and the interquartile range, which is less sensitive to artifacts than a z-score.

From each epoch we extract 275 features. Per channel, we use temporal statistics and band powers (δ, θ, α, σ, β) from Welch spectra. We add the spectral entropy and edge frequency, the Hjorth parameters, the Katz fractal dimension and the permutation entropy. Between channel pairs, we use correlations and power ratios. We also tried adding the features of the neighboring epochs, but this tripled the input size and overfitted with only 8 subjects.

The main model is a multiclass gradient boosting classifier with balanced class weights. N1 is the hardest stage, so we trained a second, binary model on N1 against the rest. Only its N1 probability is blended with the multiclass one:

$$\tilde{P}(N1 \mid x) = \alpha\, P_{\text{bin}}(N1 \mid x) + (1 - \alpha)\, P_{\text{multi}}(N1 \mid x).$$

The other classes keep the multiclass probabilities, and the vector is renormalized. A grid search on the out-of-fold F1 gave $\alpha = 0.10$. The binary model brought about 4 F1 points on N1.

Sleep stages follow each other in a structured way. So we treat the stages of one night as a hidden Markov chain, with a transition matrix $A$ estimated on the training nights. The classifier outputs act as emission scores $$b_j(x_t)$$, and Viterbi decoding finds the most likely sequence:

$$\delta_t(j) = b_j(x_t) \max_i \big( \delta_{t-1}(i)\, A_{ij} \big).$$

This removes many isolated N1 predictions inside long N2 blocks.

Epochs from the same night are strongly correlated, so a random split would be too optimistic. We validate with leave-one-subject-out cross-validation (8 folds). For the test set, the 8 fold models are averaged.

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

Per-class F1 in cross-validation, after fusion and Viterbi:

| Stage | Wake | N1 | N2 | N3 | REM |
|---|---:|---:|---:|---:|---:|
| F1 | 0.87 | 0.43 | 0.88 | 0.84 | 0.88 |

N1 stays far behind the other stages. Most of its errors are confusions with N2 and with Wake, which human experts also find hard to separate.
