---
layout: page
title: Pédantix bot
description: Teaching an agent to find the hidden Wikipedia article in a word-guessing game. RL, language models and clustering.
img: assets/img/projects/thumbs/pedantix.jpg
importance: 3
category: research
---

Third-year research project at CentraleSupélec (2025–2026), with Ghaith Harzalli and Agathe Meurisse, in partnership with Illuin Technology.

[Pédantix](https://pedantix.certitudes.org/) is a French word-guessing game. You see a Wikipedia article with every word hidden, and you must find its title. Each correct guess reveals that word everywhere in the text. A wrong guess still gets a proximity score, which tells you how close you are to the topic. We built our own version of the game and tried three ways to solve it.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-ui.png" title="Our Pédantix interface" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Our game interface. Found words are revealed, close guesses appear as grey hints.
</div>

**Clustering.** We clustered the vocabulary (K-means and HDBSCAN on UMAP projections of word embeddings) to find which words reveal the most articles. This guided the two players below.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-wordcloud-britain.png" title="Great Britain" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-wordcloud-yugoslavia.png" title="Yugoslavia" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Word clusters found in the articles "Great Britain" and "Yugoslavia" (UMAP, 100 clusters). Colors are clusters, size is frequency.
</div>


For K-means, UMAP was necessary. Without it, silhouette scores stayed below 0.05. With it, they were all above 0.3, with a maximum around 0.39 in 2 dimensions. HDBSCAN left too many words as outliers (17% or more for the best runs), so we kept K-means.

**Reinforcement learning.** A custom Gymnasium environment on Simple English Wikipedia. The agent picks words with action masking, sees FastText proximity scores, and gets rewards weighted by TF-IDF. We trained it with MaskablePPO and a curriculum that moves to harder articles once the win rate passes 90%. The best agent wins 96% of test games, against 26% for random guessing. Without the curriculum it drops to 46%.

The observation $s_t \in \mathbb{R}^{1135}$ holds the mean FastText vector of the visible text, the five visible words with the highest IDF (the "IDF spotlight"), the last guesses, the title structure and a few progress numbers. The reward at step $t$ is

$$
r_t = -0.01 - 0.30 \cdot \mathbb{1}[\text{repeat}] + 0.2\, \mathrm{IDF}(a_t)\, \mathbb{1}[\text{body word}] + r_{\text{nav}} + r_{\text{title}} + 50 \cdot \mathbb{1}[\text{win}],
$$

where $r_{\text{nav}}$ gives up to +5 for a new best proximity and $r_{\text{title}}$ gives +5 per title word found. An earlier dense reward of $0.5 \cdot \text{prox}_t$ at every step made the agent hover around the topic without finishing. It lowered the win rate from 50% to 44%. Training used 32 parallel environments, 10 million steps and a cosine learning rate from $3 \times 10^{-4}$ to $3 \times 10^{-5}$.

| RL agent (vocabulary of 1,000 words) | Test win rate | Mean steps |
|---|---:|---:|
| Random guessing | 26% | 432 |
| Baseline (MLP, last 5 guesses) | 50% | ~300 |
| **Deeper MLP [512, 512, 256], last 10 guesses** | **96%** | **76.5** |
| Best model without action masking | 8% | |
| Best model without curriculum | 46% | ~213 |
| Best model without IDF spotlight | 56% | ~180 |
| Best model with 3,000-word vocabulary | 12% | ~470 |
| SAC with a continuous 300-d action | 34% | ~238 |

Every attempt to grow the vocabulary failed. Each word was not tried often enough for the agent to learn its value. The 1,000-word list only covers about 12% of Simple English Wikipedia, so the 96% holds for a restricted game.

**Masked language model.** A DistilBERT model adapted to Simple English fills in the hidden words from the visible context. It is less strategic but works with a much larger vocabulary. We built it in steps: lemma-level targets, beam search over WordPiece tokens with sliding windows, a policy that favors candidates likely to fill title slots, and two fallback stages that switch to the partly revealed title when the body stops helping. The domain adaptation uses LoRA ($r = 16$, $\alpha = 32$) for 3 epochs on 87,000 articles.

| MLM player (50 test articles) | Full title found | Title coverage |
|---|---:|---:|
| V1, lemma targets | 20% | 0.267 |
| V2, beam search and windows | 18% | 0.233 |
| V3, title-gain policy | 16% | 0.223 |
| V4, with fallback stages | 30% | 0.223 |
| **V4, LoRA-adapted DistilBERT** | **36%** | **0.333** |

More elaborate search (V2, V3) did not help on its own. The fallback stages added 14 points of success for the base model. LoRA improved the main loop too, from 16% to 26% success before any fallback.

<div class="row justify-content-sm-center">
    <div class="col-sm-7 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-mlm.png" title="Masked language modeling" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Pédantix has the same structure as masked language modeling: predict hidden words from their context.
</div>

Neither player is perfect. The RL agent navigates well but only knows 1,000 words. The language model knows many more words but has no long-term strategy. A strong player would combine both.
