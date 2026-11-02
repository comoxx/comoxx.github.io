---
layout: page
title: Reverse-engineering a dehazing filter
description: Rebuilding DxO's ClearView Plus with the dark channel prior.
img: assets/img/projects/thumbs/clearview.jpg
importance: 10
category: coursework
---

DxO PhotoLab has a one-click filter, **ClearView Plus**, that removes haze from photos. It is closed source. The goal of the project was to infer how it works and reproduce it.

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

### Observations

- **It is local.** The same color is treated differently depending on its surroundings. So it is not a global curve.
- **It mostly respects edges, but not perfectly.** On synthetic test images we found very thin halos along sharp borders, bright on one side and dark on the other. That is the signature of the **dark channel prior**, with a refined transmission map on top.
- **The sky splits in two.** The brightest hazy area gets brighter and the rest of the sky gets darker. A physical model would not do that. It points to a contrast pivot placed on the region used to estimate the atmospheric light.
- **No sky, more contrast.** On photos without sky, the pivot lands on the ground colors and the result is much harsher. That is exactly what ClearView does on our two sky-free photos.

### Our reconstruction

A Koschmieder haze model, a transmission map from the [dark channel prior](https://doi.org/10.1109/CVPR.2009.5206515) (He et al., CVPR 2009), an atmospheric light taken from the brightest dark-channel pixels, a refinement step against halos, then a contrast post-processing around that pivot.

*Machine Intelligence of Images course, Master MVA, 2025. With Étienne Maugars and Guillaume Bernard.*
