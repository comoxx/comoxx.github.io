---
layout: page
title: Community detection in graphs
description: From spectral clustering to stochastic block models and graph autoencoders.
img: assets/img/projects/thumbs/clustering.jpg
importance: 18
category: coursework
github: https://github.com/comoxx/Probabilistic-Graph-Models
---

Probabilistic graphical models project (Master MVA, 2025), with Nathan Bouvier and Yasmine Daouia.

Many real networks (social, biological, communication) form communities: groups of nodes with more links inside than between them. We reviewed the main methods to find them, in chronological order. We started with spectral clustering, then the Erdős–Rényi mixture model (a stochastic block model), and finally GraphEncoder ([Tian et al., AAAI 2014](https://doi.org/10.1609/aaai.v28i1.8916)), a sparse autoencoder that approximates spectral embeddings at a lower cost. We implemented the models in a common framework to compare them on simulated graphs.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/clustering-adjacency.png" title="" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/clustering-graphencoder.png" title="" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: adjacency matrix of a simulated graph, sorted by its true communities. Right: true communities and GraphEncoder predictions.
</div>
