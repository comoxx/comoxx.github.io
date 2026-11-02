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

**Spectral clustering**

Given a similarity matrix $A$ with degree matrix $D$, we compute the normalized Laplacian

$$
L_{\text{sym}} = I - D^{-1/2} A D^{-1/2}.
$$

We take the $k$ eigenvectors of the $k$ smallest eigenvalues and stack them in $U \in \mathbb{R}^{n \times k}$. Each row is normalized to unit length, and k-means clusters the rows. This solves a relaxed version of the normalized cut problem. The eigendecomposition costs $O(n^3)$.

**Erdős–Rényi mixture (ERMG)**

This is a stochastic block model. Each vertex $i$ gets a class $q$ with probability $\alpha_q$. Two vertices in classes $q$ and $\ell$ are linked with probability $\pi_{q\ell}$. With $Z_{iq} = 1$ when vertex $i$ is in class $q$, the complete-data log-likelihood is

$$
\log L(X, Z) = \sum_i \sum_q Z_{iq} \log \alpha_q + \sum_{i} \sum_{j > i} \sum_{q, \ell} Z_{iq} Z_{j\ell} \log b(X_{ij}; \pi_{q\ell}),
$$

where $b$ is the Bernoulli density. The exact posterior $P(Z \mid X)$ sums over $Q^n$ assignments, so we fit the model with a variational EM (mean-field approximation). To choose the number of classes $Q$, we used an ICL-type criterion:

$$
-2\,\mathcal{Q}(X) + (Q-1)\log n + \frac{Q(Q+1)}{2} \log \frac{n(n-1)}{2}.
$$

**GraphEncoder**

The input is the $i$-th row $x_i$ of the transition matrix $P = D^{-1}A$. Each layer is a sparse autoencoder with encoder $h_i = \sigma(W^{(1)} x_i + b^{(1)})$ and a symmetric decoder. Its loss is

$$
\mathcal{L}(\theta) = \sum_{i=1}^n \lVert x_i - \hat{x}_i \rVert_2^2 + \beta \sum_j \mathrm{KL}(\rho \,\Vert\, \hat{\rho}_j),
$$

where $\hat{\rho}_j$ is the mean activation of hidden unit $j$ and $\rho = 0.05$ is the target sparsity. We stacked layers (for example 64 then 32 units), trained them greedily one at a time, and ran k-means on the last embedding.

**Modularity**

As a fourth baseline we used Louvain modularity optimization. The modularity of a partition $C$ is

$$
Q(C) = \frac{1}{2m} \sum_{i,j} \left( A_{ij} - \gamma \frac{k_i k_j}{2m} \right) \mathbb{1}_{c_i = c_j},
$$

where $k_i$ is the degree of node $i$ and $m$ the number of edges. The resolution $\gamma$ sets the scale of the communities. We studied its effect on the number of communities found on the Karate Club graph.

**Results**

Clustering accuracy after matching predicted and true labels with the Hungarian algorithm (%).

| Method | Football games | Karate club | Cora |
|---|---:|---:|---:|
| ERMG | 11.3 | 55.8 | / |
| Spectral clustering | 91.3 | 97.06 | 29.0 |
| GraphEncoder (sparse autoencoder) | **94.78** | **97.06** | 27.2 |
| Modularity-based clustering | 86.9 | 82 | **36.9** |

GraphEncoder and spectral clustering recover both factions of the Karate Club with the same accuracy. On the football graph GraphEncoder is slightly better. ERMG only worked when communities were very well separated (with $\pi$ close to a diagonal matrix). It failed on real graphs, which do not follow a block model. On Cora, all methods stay low, and modularity does best.

GraphEncoder has a better theoretical cost, $O(ncd)$ with $c$ the mean degree and $d$ the hidden size. In practice it was the slower one. On Cora it took minutes to train, while spectral clustering ran in seconds.
