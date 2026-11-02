---
layout: page
title: Retinal vessel segmentation
description: Segmenting blood vessels in eye fundus images with classical image processing.
img: assets/img/projects/thumbs/retina.jpg
importance: 13
category: coursework
---

The task is to segment blood vessels in retinal images without deep learning. We work on the 20 images of the DRIVE dataset that come with manual annotations. The score is the Dice coefficient between our mask $P$ and the manual mask $G$, averaged over the images:

$$\text{Dice}(P, G) = \frac{2\,|P \cap G|}{|P| + |G|}.$$

The field of view is found by a simple threshold on the gray level ($> 0.1$). All later steps only look inside it.

**Method**

1. **Contrast.** Vessels are most visible in the green channel. We apply CLAHE to it (clip limit 3.5, 8×8 tiles).
2. **Black top-hat.** Vessels are thin dark structures. A morphological closing with a disk $B$ fills them, and the difference brings them out:

    $$\text{BTH}(f) = (f \bullet B) - f, \qquad f \bullet B = (f \oplus B) \ominus B.$$

    The baseline uses a disk of radius 11. The final pipeline uses radius 6.
3. **Matched filter.** The cross-section of a vessel looks like a Gaussian. We convolve the inverted image with a zero-mean kernel that has a Gaussian profile ($\sigma = 2$, length 11) across its axis. The kernel is rotated in 12 directions and we keep the maximum response.
4. **Meijering filter.** A ridge filter based on the Hessian, at scales $$\sigma \in \lbrace 1, 2, 3 \rbrace$$.
5. **Fusion.** Each response is divided by its maximum, then combined:

    $$R = 0.40\,\widehat{\text{BTH}} + 0.30\,\widehat{\text{MF}} + 0.30\,\widehat{\text{Meij}}.$$

    The weights come from a grid search.
6. **Threshold.** The Isodata method picks a threshold $\tau$ on $R$ that sits halfway between the mean of the pixels below it and the mean of the pixels above it.
7. **Seed and grow.** Confident pixels $$S_0 = \lbrace R > 1.15\,\tau \rbrace$$ are the seeds. They grow into weaker neighbors (8-connectivity) as long as these pass a low threshold:

    $$S_{k+1} = S_k \cup \Big( (S_k \oplus B_8) \cap \{R > 0.25\} \cap \text{FOV} \Big),$$

    until nothing changes. This is a reconstruction by dilation. A weak pixel is kept only if it connects to a strong one.
8. **Cleanup.** Components smaller than 15 pixels are removed.

**Results**

Mean Dice on the 20 images after each step:

| Step | Dice |
|---|---:|
| Baseline: black top-hat + automatic threshold | 0.654 |
| Contrast enhancement (CLAHE) on the green channel | 0.698 |
| Fusion of three filters: top-hat, matched filter, Meijering | 0.721 |
| Hysteresis on high and low confidence pixels | 0.733 |
| **Grow vessels from confident seeds along connected pixels** | **0.737** |
| *(for comparison) random forest on the same features* | *0.736* |

The last gains came from topology, not from better filters. Thin capillaries were found but broken into pieces. Growing them from strong seeds reconnects them.

Several other ideas did not help:

| Variant | Dice |
|---|---:|
| Meijering filter alone | 0.682 |
| Product of top-hat and Meijering | 0.584 |
| Matched filter alone (very sensitive to noise) | 0.468 |
| Component-tree filtering (Higra) | about 0.70 |

Denoising with non-local means or a median filter erased capillaries and lowered the score. A random forest trained pixel by pixel on the three filter responses reached 0.736, which did not beat the hand-tuned pipeline.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/retina-pipeline.png" title="Pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The filters and the final segmentation.
</div>

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/retina-result.png" title="Result vs manual annotation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Original image, our segmentation, manual annotation.
</div>

*Image analysis course, CentraleSupélec, 2026. DRIVE dataset.*
