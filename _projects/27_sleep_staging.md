---
layout: page
title: Sleep staging from EEG
description: Sleep stages from a five-channel EEG headband, with gradient boosting and an HMM. Ranked 1st of 122 teams.
img: assets/img/projects/thumbs/sleep.jpg
importance: 1
category: coursework
---

Kaggle challenge of the Machine Learning course at CentraleSupélec (Beacon Biosignals, 2025), with Etienne Maugars.

Each 30-second epoch of EEG from the Dreem headband (5 channels, 100 Hz) must be labeled Wake, N1, N2, N3 or REM. Training data covers only 8 subjects, one night each, for 7,433 epochs. The classes are unbalanced: N2 is 44% of the epochs and N1 only 6.8%. The metric is macro F1, the unweighted mean of the per-class F1 scores:

$$F1_{\text{macro}} = \frac{1}{5} \sum_{c \in \{W, N1, N2, N3, REM\}} \frac{2 \cdot \text{Precision}_c \cdot \text{Recall}_c}{\text{Precision}_c + \text{Recall}_c}.$$

So the rare N1 stage counts as much as N2.

**Pipeline**

1. **Preprocessing.** Zero-phase Butterworth band-pass of order 4 (0.5–45 Hz), which removes drift and 50 Hz mains noise. Then a robust normalization per channel, less sensitive to artifacts than a z-score:

    $$X_{\text{norm}} = \frac{X - \text{median}(X)}{\text{IQR}(X) / 1.349}.$$

    The factor 1.349 makes the denominator match the standard deviation for Gaussian data.
2. **Features.** 275 per epoch: 49 per channel and 30 for the 10 channel pairs (see below).
3. **Two models.** A multiclass gradient boosting model, plus a binary model specialized on N1. Their N1 probabilities are blended.
4. **Temporal smoothing.** Viterbi decoding with a transition matrix learned from the training nights, since sleep stages follow each other in a structured way.

**Features**

Per channel, we compute the mean, standard deviation, skewness and kurtosis of the signal and of its first and second differences, plus the zero-crossing rate. The power spectral density $S_{xx}(f)$ is estimated with Welch's method. For each band $b$ among δ (0.5–4 Hz), θ (4–8 Hz), α (8–12 Hz), σ (11–16 Hz) and β (16–30 Hz):

$$P_{\text{abs}}(b) = \int_{f \in b} S_{xx}(f)\, df, \qquad P_{\text{rel}}(b) = \frac{P_{\text{abs}}(b)}{\int_{0.5}^{45} S_{xx}(f)\, df}.$$

We add the spectral edge frequency (below which 95% of the power lies) and the spectral entropy $H = -\sum_f P_{\text{rel}}(f) \log_2 P_{\text{rel}}(f)$. A flat, noise-like spectrum gives a high entropy. A clear rhythm such as alpha or spindles gives a low one.

For complexity, the Hjorth parameters describe the spectrum in the time domain. Mobility estimates the mean frequency, and complexity measures how much it varies:

$$\text{Mobility}(X) = \sqrt{\frac{\text{var}(X')}{\text{var}(X)}}, \qquad \text{Complexity}(X) = \frac{\text{Mobility}(X')}{\text{Mobility}(X)}.$$

The Katz fractal dimension measures the roughness of the curve, with $N$ samples, $L$ the total curve length and $d$ the largest distance from the first point:

$$D_{\text{Katz}} = \frac{\log_{10} N}{\log_{10}(d/L) + \log_{10} N}.$$

Permutation entropy, based on the frequency of ordinal patterns, drops sharply in deep sleep (N3). Between channels, we use Pearson correlations and power ratios.

We also tried to add the features of the neighboring epochs. This triples the input size (275 to 825) and led to overfitting with only 8 subjects. The temporal context is handled by the HMM instead.

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

**Models**

Both models are scikit-learn HistGradientBoosting classifiers (200 iterations, learning rate 0.05, depth 4) with balanced class weights. The binary model is trained on N1 against the rest. Only its N1 probability is blended with the multiclass one:

$$\tilde{P}(N1 \mid x) = \alpha\, P_{\text{bin}}(N1 \mid x) + (1 - \alpha)\, P_{\text{multi}}(N1 \mid x),$$

the other classes keep $P_{\text{multi}}$, and the vector is renormalized to sum to 1. A grid search on the out-of-fold F1 gave $\alpha = 0.10$. The binary model brought about 4 F1 points on N1 compared with the multiclass model alone.

**Viterbi decoding**

The stages of one night form a hidden Markov chain with transitions $A_{ij} = P(y_t = j \mid y_{t-1} = i)$, estimated on the training nights. The classifier outputs act as emission scores $b_j(x_t)$. Viterbi finds the most likely sequence by dynamic programming:

$$\delta_1(j) = \pi_j\, b_j(x_1), \qquad \delta_t(j) = b_j(x_t) \max_i \big( \delta_{t-1}(i)\, A_{ij} \big),$$

keeping $\psi_t(j) = \arg\max_i \delta_{t-1}(i) A_{ij}$. The path is read backwards from $$\hat{y}_T = \arg\max_j \delta_T(j)$$ with $$\hat{y}_{t-1} = \psi_t(\hat{y}_t)$$. This removes many isolated N1 predictions inside long N2 blocks.

**Validation**

Epochs from the same night are strongly correlated, so a random split would be too optimistic. We use leave-one-subject-out cross-validation (8 folds). For the test set, the 8 fold models are averaged like a bagging ensemble.

**Results**

| Evaluation | Macro F1 |
|---|---:|
| Leave-one-subject-out cross-validation | 0.78 |
| Kaggle public leaderboard | 0.821 |
| Kaggle private leaderboard | 0.800 |

Final ranking: **1st of 122 teams** on the private leaderboard.

Per-class scores in cross-validation (after fusion and Viterbi):

| Stage | Precision | Recall | F1 | Epochs |
|---|---:|---:|---:|---:|
| Wake | 0.88 | 0.86 | 0.87 | 1,200 |
| N1 | 0.46 | 0.41 | 0.43 | 509 |
| N2 | 0.88 | 0.88 | 0.88 | 3,269 |
| N3 | 0.83 | 0.85 | 0.84 | 1,034 |
| REM | 0.86 | 0.91 | 0.88 | 1,421 |
| Macro average | 0.78 | 0.78 | 0.78 | 7,433 |

N1 remains the weak point. Most errors are confusions between N1 and N2 and between N1 and Wake. This matches the literature, where human experts also agree poorly on N1.
