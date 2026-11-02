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

I built the whole game: the rarity system, the pack draws, the hourly timer and the web front end.

**Rarity**

Rarity follows a film's stature, not what is trending. Each film gets a Bayesian weighted rating, the formula behind the IMDb Top 250, with a prior of 2,000 votes. This stops a film with 6 votes at 9.5 from beating one with 30,000 votes at 8.7.

Getting rarity right took four attempts. TMDb's `popularity` field is a trending signal, so new releases went legendary and Pulp Fiction went common. Multiplying the rating by the log of the vote count turned the ranking into a popularity chart. Dropping the log term was not enough, because TMDb voters skew modern and vote much less on old films.

So a film is now ranked only against films of its own decade. The tier is a percentile of the weighted rating inside that cohort. A hand-curated list of about 370 canon films gets a minimum tier. A film also needs to be at least 10 years old to reach the top tier on statistics alone.

| Tier | Share of each decade |
|---|---:|
| Canon | top 1.2% |
| Classic | next 8% |
| Feature | next 25% |
| Screening | the rest |

**Packs**

A pack has four ordinary slots and one slot that is always Feature or better. A Canon lands in about one pack in 150, so after 100 packs without one, a pity timer starts. The chance of forcing a Canon into the guaranteed slot then grows linearly and reaches 1 at 250 dry packs.

Packs accrue at one per hour, up to 10 in the bank. The server stores the balance and an anchor time, and the client never sends a time or chooses cards. Changing the system clock does nothing. Opening a pack locks the user row inside a transaction, so two parallel requests cannot spend the same pack.

Duplicate cards can be dissolved into "frames" to buy extra packs. There is also a daily film quiz, badges, profiles and a leaderboard. The stack is Next.js, Drizzle ORM, Supabase Postgres and the TMDb API, hosted on Vercel.
