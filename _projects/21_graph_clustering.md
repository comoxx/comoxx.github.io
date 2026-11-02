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

GraphEncoder reaches 94.8% accuracy on the football network, slightly above spectral clustering (91.3%).

Many real networks (social, biological, communication) form communities: groups of nodes with more links inside than between them. We reviewed the main methods to find them, in chronological order. We started with spectral clustering, then the Erdős–Rényi mixture model (a stochastic block model), and finally GraphEncoder ([Tian et al., AAAI 2014](https://doi.org/10.1609/aaai.v28i1.8916)), a sparse autoencoder that approximates spectral embeddings at a lower cost. We implemented the models in a common framework to compare them on simulated and real graphs.

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

**Method**

Spectral clustering takes the eigenvectors of the normalized Laplacian for the smallest eigenvalues, normalizes each row and runs k-means on the rows. The eigendecomposition costs $O(n^3)$.

The Erdős–Rényi mixture gives each node a hidden class. Two nodes are linked with a probability that depends only on their classes. The exact posterior is intractable, so we fit the model with a variational EM. We chose the number of classes with an ICL-type criterion.

GraphEncoder takes each row of the random-walk transition matrix as input. We stacked sparse autoencoder layers (for example 64 then 32 units), trained them greedily one at a time, and ran k-means on the last embedding. As a fourth baseline we used Louvain modularity optimization. We also studied how its resolution parameter changes the number of communities found on the Karate Club graph.

**Results**

Clustering accuracy (%) after matching predicted and true labels with the Hungarian algorithm.

| Method | Football games | Karate club | Cora |
|---|---:|---:|---:|
| ERMG | 11.3 | 55.8 | / |
| Spectral clustering | 91.3 | 97.06 | 29.0 |
| GraphEncoder (sparse autoencoder) | **94.78** | **97.06** | 27.2 |
| Modularity-based clustering | 86.9 | 82 | **36.9** |

ERMG only worked on simulated graphs with very well separated communities. It failed on real graphs, which do not follow a block model. On Cora all methods stay low, and modularity does best. GraphEncoder has a lower theoretical cost than spectral clustering, but in practice it was slower. On Cora it took minutes to train, while spectral clustering ran in seconds.
