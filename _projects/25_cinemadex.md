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

**Rarity.** Rarity follows a film's stature, not what is trending. Each film gets a Bayesian weighted rating, the formula behind the IMDb Top 250:

$$
\text{WR} = \frac{v}{v + 2000} R + \frac{2000}{v + 2000} C
$$

where $R$ is the film's rating, $v$ its number of votes and $C$ the average rating over the catalogue. The prior of 2,000 votes stops a film with 6 votes at 9.5 from beating one with 30,000 votes at 8.7. Films under 100 votes are always common.

Getting rarity right took four attempts. The first used TMDb's `popularity` field. It is a short-term trending signal, so new releases went legendary and Pulp Fiction went common. The second multiplied WR by $\log_{10}(v + 10)$. That turned the ranking into a popularity chart: Avengers: Endgame came 15th and Seven Samurai 375th. Dropping the log term was not enough either. TMDb voters skew modern and vote much less on old films, so both inputs still measure reach.

The current version adds two things:

- **Decade cohorts.** A film is ranked only against films of its own decade. The catalogue holds 11 films from the 1930s and 1,161 from the 2010s. The mean TMDb rating falls from 7.92 in the 1950s to 6.88 in the 2010s. Everything before 1940 shares one cohort, and cohorts under 12 films are merged into a global one.
- **A canon floor.** A hand-curated list of about 370 films (Sight & Sound, AFI 100, Palme d'Or and Best Picture winners, Criterion) gets a minimum tier. Entries match on title and release year within one year. The floor only promotes a film, it never demotes one.

Inside each cohort, the tier is a percentile of WR. A film also needs to be at least 10 years old to reach the top tier on statistics alone. TMDb rates anticipation too, so a very recent film can top its cohort before anyone has a settled opinion of it.

| Tier (on screen) | Stored as | Share of each decade |
|---|---|---:|
| Canon | legendary | top 1.2% |
| Classic | epic | next 8% |
| Feature | rare | next 25% |
| Screening | common | the rest |

Percentiles are global within a cohort, so rarity is recomputed over the whole table after every import. An early version only ranked the freshly fetched batch. Older rows kept stale tiers, and at one point a film with 5 votes was legendary while Pulp Fiction was common.

**Packs.** A pack has four ordinary slots and one guaranteed slot that is always Feature or better. The draw happens on the server, and the cards are revealed from worst to best. The odds below come from the weights in the code and are checked by a simulation script.

| Per pack | Chance |
|---|---:|
| At least one Feature or better | 100% |
| At least one Classic or better | ~10.8% |
| At least one Canon | ~0.7% |

A Canon lands in about one pack in 150, so some players would wait a very long time. On the base rate, one player in fifty still has none after 580 packs. A pity timer fixes the tail. After $n$ packs without a Canon, the guaranteed slot is forced to Canon with probability

$$
P(n) = \min\left(1, \max\left(0, \frac{n - 100}{250 - 100}\right)\right).
$$

Before 100 dry packs, nothing changes.

**Timer.** Packs accrue: one per hour, up to 10 in the bank. The server stores the balance and an anchor time. It advances the anchor by whole intervals only, so partial progress toward the next pack is never lost. A backwards clock jump grants nothing. The client never sends a time and never chooses cards, so changing the system clock does nothing. Opening a pack locks the user row (`SELECT ... FOR UPDATE`) inside a transaction. Without it, two parallel requests could both spend the same pack.

**Other features.** Duplicate cards can be dissolved into "frames" (24 per second of film). Frames buy extra packs or "print packs" that guarantee a Classic or Canon you do not own yet. There is also a daily five-question film quiz built from the catalogue, badges, profiles and a leaderboard. The quiz is derived from the date, so everyone gets the same questions and the server can re-derive the answers when grading.

**Stack.** Next.js (App Router), Drizzle ORM, Supabase Postgres, the TMDb API for the catalogue, hosted on Vercel. Sign-in uses Supabase Auth, and the game's user row reuses the auth user id as its key. The pack-opening animation is plain CSS: a foil wrapper that tears into two halves, then cards dealt face up one by one. All motion is disabled when the browser asks for reduced motion.
