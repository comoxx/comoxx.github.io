---
layout: page
title: Reverse-engineering a dehazing filter
description: Rebuilding DxO's ClearView Plus with the dark channel prior.
img: assets/img/projects/thumbs/clearview.jpg
importance: 10
category: coursework
---

DxO PhotoLab has a one-click filter, **ClearView Plus**, that removes haze from photos. It is closed source. The goal of the project was to infer how it works and reproduce it. We had twelve photos to test on, and we also built synthetic test patterns (flat blocks, edge ramps, smooth gradients) to probe the filter in controlled conditions.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/clearview-input.jpg" title="Input" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/clearview-transmission.jpg" title="Transmission map" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/clearview-result.jpg" title="Our result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Input, estimated transmission map, our dehazed result.
</div>

**Haze model**

Most physical dehazing methods start from the Koschmieder model:

$$I(x) = J(x)\, t(x) + A \big(1 - t(x)\big), \qquad t(x) = e^{-\beta d(x)}.$$

$I$ is the observed image, $J$ the haze-free scene, $A$ the atmospheric light and $t$ the transmission. The transmission decays with the scene distance $d(x)$ at a rate set by the attenuation coefficient $\beta$. Only $I$ is known. So we need priors to estimate $t$ and $A$, then invert the model.

**Observations on ClearView Plus**

- **It is local.** On a synthetic pattern, the same color is treated differently depending on its surroundings. So it is not a global tone curve.
- **It mostly respects edges, but not perfectly.** On synthetic images we found very thin halos along sharp borders, bright on the gray side and dark on the black side. We compared them with the halos of a plain dark channel prior with a 15×15 patch. This points to the **dark channel prior** with a refined transmission map on top.
- **The sky splits in two.** The brightest hazy area gets brighter and the rest of the sky gets darker. A physical model would not do that. It points to a contrast pivot placed on the region used to estimate $A$.
- **No sky, more contrast.** On photos without sky, the pivot lands on ground colors and the result is much harsher. That is exactly what ClearView does on the two sky-free photos of our set.

**Our reconstruction**

We work on the linear RAW data (no gamma), since the haze model is linear in light intensity.

1. **Dark channel.** Following [He et al.](https://doi.org/10.1109/CVPR.2009.5206515) (CVPR 2009), in a haze-free outdoor image most patches outside the sky contain a pixel that is very dark in at least one channel:

    $$J^{\text{dark}}(x) = \min_{y \in \Omega(x)} \; \min_{c \in \{r,g,b\}} J^c(y) \approx 0.$$

2. **Atmospheric light.** We take the 0.1% of pixels with the highest dark channel (usually haze or bright sky). Among them, the brightest pixels of the input give $A$. This avoids picking a white object as the haze color.
3. **Coarse transmission.** Dividing the model by $A$ and taking the minimum over the patch gives

    $$\tilde{t}(x) = 1 - \omega \min_{y \in \Omega(x)} \min_c \frac{I^c(y)}{A^c},$$

    with $\omega = 0.95$ (a little haze is kept as a depth cue) and a 15×15 patch.
4. **Refinement.** The coarse map is blocky and creates halos at edges. Total variation gave piecewise-constant maps, which looked wrong on roads going to the horizon. We switched to a guided Total Generalized Variation, which gives piecewise-smooth maps:

    $$\min_{t,\,w} \; \alpha_1 \big\| D^{1/2} (\nabla t - w) \big\|_1 + \alpha_0 \|\nabla w\|_1 + \|t - \tilde{t}\|_1,$$

    with $\alpha_0 = 0.5$ and $\alpha_1 = 0.05$. The weight $D = \exp(-\gamma \lvert \nabla I \rvert^{\beta})$ comes from the input image and lowers smoothing across its edges. We solve it with a primal-dual algorithm.
5. **Recovery.** The scene is recovered by inverting the model, with a lower bound $t_0 = 0.1$ to avoid amplifying noise in thick haze:

    $$J(x) = \frac{I(x) - A}{\max\big(t(x), t_0\big)} + A.$$

6. **Post-processing.** A tone curve adds contrast around the pivot found in step 2.

**What we could not explain**

We judged our results visually against ClearView on the test photos. There is no ground truth for a closed filter, so we have no numerical score. Some traces of ClearView remained open at the end: added noise, a crushed histogram on one photo (probably a non-linear function that keeps colors in range), and concentric circles on test patterns where a simple contrast boost gives concentric squares.

*Machine Intelligence of Images course, Master MVA, 2025. With Étienne Maugars and Guillaume Bernard.*
