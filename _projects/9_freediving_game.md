---
layout: page
title: Freediving game
description: A pygame freediving game where your real breath hold is the timer.
img: assets/img/projects/thumbs/freediving.jpg
importance: 3
category: personal
github: https://github.com/comoxx/FreedivingGame
---

A small pygame game about freediving, a sport I practice.

In **Play** mode there is no oxygen bar: the player holds their breath for real. Enter kicks down, Space turns around, and at the surface the game asks whether you made it.

The game follows a few real mechanics:

- You only have **30 fin kicks** per dive. Spend them too early and you are stuck deep.
- Around **20 m** you become negatively buoyant and start to sink on your own. Use it to save energy on the way down.
- **Explore** mode adds a virtual oxygen bar, for when you would rather look at the fish.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/freediving.png" title="Start screen" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Made with Python and pygame. [Code on GitHub](https://github.com/comoxx/FreedivingGame).
