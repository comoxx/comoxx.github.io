---
layout: page
title: Cinemadex
description: A collectible card game where movies are the cards. Open a free pack every hour.
img: assets/img/projects/thumbs/cinemadex.jpg
importance: 2
category: personal
---

A personal web app: a collectible card game where every card is a movie. You get a free pack of five cards every hour, and the rarer the film, the rarer the card. [Play it here](https://cinemadex.vercel.app).

<div class="row justify-content-sm-center">
    <div class="col-sm-11 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/cinemadex-pack.jpg" title="A sealed pack" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The pack screen: a sealed booster, with banked packs stacked behind it.
</div>

**Rarity.** Rarity follows a film's stature, not what is trending. Each film gets a Bayesian weighted rating (the IMDb Top 250 formula), scaled by how many people rated it:

$$
\text{WR} = \frac{v}{v + 2000} R + \frac{2000}{v + 2000} C, \qquad \text{score} = \text{WR} \cdot \log_{10}(v + 10)
$$

where $R$ is the film's rating, $v$ its number of votes and $C$ the average rating over the catalogue.

**Stack.** Next.js (App Router), Drizzle ORM, Supabase Postgres, the TMDb API for the catalogue, hosted on Vercel.
