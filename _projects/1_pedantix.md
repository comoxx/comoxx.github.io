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


**Reinforcement learning.** A custom Gymnasium environment on Simple English Wikipedia. The agent picks words with action masking, sees FastText proximity scores, and gets rewards weighted by TF-IDF. We trained it with MaskablePPO and a curriculum that moves to harder articles once the win rate passes 90%. The best agent wins 96% of test games, against 26% for random guessing. Without the curriculum it drops to 46%.

**Masked language model.** A DistilBERT model adapted to Simple English fills in the hidden words from the visible context. It is less strategic but works with a much larger vocabulary.

<div class="row justify-content-sm-center">
    <div class="col-sm-7 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pedantix-mlm.png" title="Masked language modeling" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Pédantix has the same structure as masked language modeling: predict hidden words from their context.
</div>

Neither player is perfect. The RL agent navigates well but only knows 1,000 words. The language model knows many more words but has no long-term strategy. A strong player would combine both.
