---
layout: page
title: Pédantix bot
description: Teaching an agent to find the hidden Wikipedia article in a word-guessing game. RL, language models and clustering.
img: assets/img/projects/thumbs/pedantix.jpg
importance: 3
category: research
---

Third-year research project at CentraleSupélec (2025–2026), with Ghaith Harzalli and Agathe Meurisse, in partnership with Illuin Technology.

Our best reinforcement learning agent wins 96% of test games with a 1,000-word vocabulary, against 26% for random guessing.

[Pédantix](https://pedantix.certitudes.org/) is a French word-guessing game. You see a Wikipedia article with every word hidden, and you must find its title. Each correct guess reveals that word everywhere in the text. A wrong guess still gets a proximity score, which tells you how close you are to the topic. We built our own version of the game and tried three ways to solve it.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-ui.png" title="Our Pédantix interface" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Our game interface. Found words are revealed, close guesses appear as grey hints.
</div>

**Clustering**

We clustered the vocabulary (K-means and HDBSCAN on UMAP projections of word embeddings) to find which words reveal the most articles. This guided the two players below.

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


For K-means, UMAP was necessary. Without it, silhouette scores stayed below 0.05. With it, they were all above 0.3. HDBSCAN left too many words as outliers, so we kept K-means.

**Reinforcement learning**

We wrote a custom Gymnasium environment on Simple English Wikipedia. The agent picks words with action masking and sees FastText proximity scores. Its observation holds the mean FastText vector of the visible text, the five visible words with the highest IDF, the last guesses and the title structure. The reward at step $$t$$ is

$$
r_t = -0.01 - 0.30 \cdot \mathbb{1}[\text{repeat}] + 0.2\, \mathrm{IDF}(a_t)\, \mathbb{1}[\text{body word}] + r_{\text{nav}} + r_{\text{title}} + 50 \cdot \mathbb{1}[\text{win}],
$$

where $$r_{\text{nav}}$$ gives up to +5 for a new best proximity and $$r_{\text{title}}$$ gives +5 per title word found. An earlier dense reward based on proximity at every step made the agent hover around the topic without finishing. We trained with MaskablePPO and a curriculum that moves to harder articles once the win rate passes 90%.

| RL agent (vocabulary of 1,000 words) | Test win rate | Mean steps |
|---|---:|---:|
| Random guessing | 26% | 432 |
| Baseline (MLP, last 5 guesses) | 50% | ~300 |
| **Deeper MLP [512, 512, 256], last 10 guesses** | **96%** | **76.5** |
| Best model without action masking | 8% | |
| Best model without curriculum | 46% | ~213 |
| Best model with 3,000-word vocabulary | 12% | ~470 |

Action masking and the curriculum both matter a lot. Every attempt to grow the vocabulary failed, because each word was not tried often enough. The 1,000 words only cover about 12% of Simple English Wikipedia, so the 96% holds for a restricted game.

**Masked language model**

A DistilBERT model adapted to Simple English fills in the hidden words from the visible context. It works with a much larger vocabulary but has no long-term strategy. We built it in steps: lemma-level targets, beam search over WordPiece tokens, a policy that favors candidates likely to fill title slots, and fallback stages that switch to the partly revealed title. The domain adaptation uses LoRA on 87,000 articles.

| MLM player (50 test articles) | Full title found | Title coverage |
|---|---:|---:|
| V1, lemma targets | 20% | 0.267 |
| V3, title-gain policy | 16% | 0.223 |
| V4, with fallback stages | 30% | 0.223 |
| **V4, LoRA-adapted DistilBERT** | **36%** | **0.333** |

More elaborate search did not help on its own. The fallback stages and the LoRA adaptation gave most of the gain.

<div class="row justify-content-sm-center">
    <div class="col-sm-7 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-mlm.png" title="Masked language modeling" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Pédantix has the same structure as masked language modeling: predict hidden words from their context.
</div>
