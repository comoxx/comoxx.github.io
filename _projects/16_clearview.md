---
layout: page
title: Reverse-engineering a dehazing filter
description: Rebuilding DxO's ClearView Plus with the dark channel prior.
img: assets/img/projects/thumbs/clearview.jpg
importance: 10
category: coursework
---

We rebuilt a dehazing pipeline that reproduces the main traits of DxO's ClearView Plus on our test photos.

DxO PhotoLab has a one-click filter, **ClearView Plus**, that removes haze from photos. It is closed source. The goal of the project was to infer how it works and reproduce it. We had twelve photos to test on, and we also built synthetic test patterns to probe the filter in controlled conditions.

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

**Observations**

The filter is local. On a synthetic pattern, the same color is treated differently depending on its surroundings, so it is not a global tone curve. It mostly respects edges, but not perfectly. We found very thin halos along sharp borders, bright on one side and dark on the other. This points to the dark channel prior with a refined transmission map on top.

The sky also splits in two. The brightest hazy area gets brighter and the rest of the sky gets darker. A physical model would not do that. It suggests a contrast pivot placed on the region used to estimate the atmospheric light. On photos without sky, this pivot lands on ground colors and the result is much harsher. That is what ClearView does on our two sky-free photos.

**Our reconstruction**

We work on linear RAW data, since the haze model is linear in light intensity. We start from the Koschmieder haze model and estimate the transmission with the [dark channel prior](https://doi.org/10.1109/CVPR.2009.5206515) (He et al., CVPR 2009). The atmospheric light comes from the brightest pixels among those with the highest dark channel. The coarse transmission map is blocky, so we refine it. Total variation gave piecewise-constant maps that looked wrong on roads going to the horizon. A guided Total Generalized Variation gave smoother maps. We then invert the haze model and add contrast with a tone curve around the pivot.

There is no ground truth for a closed filter, so we compared our results with ClearView by eye.

*Machine Intelligence of Images course, Master MVA, 2025. With Étienne Maugars and Guillaume Bernard.*
