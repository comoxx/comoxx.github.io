---
layout: page
title: Text Flappy Bird with RL
description: Monte Carlo and SARSA(λ) agents for a text version of Flappy Bird.
img: assets/img/projects/thumbs/flappy.jpg
importance: 17
category: coursework
github: https://github.com/comoxx/RL_TextFlappyBird
---

Individual reinforcement learning assignment at CentraleSupélec. I compare a Monte Carlo agent and a SARSA(λ) agent on Text Flappy Bird. I study convergence speed, the effect of λ, parameter sweeps, state-space coverage, and how well each agent does on new environment settings.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/flappy-sarsa.png" title="SARSA(λ) training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/flappy-value.png" title="Monte Carlo value function" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Top: SARSA(λ) training curves. Bottom: value function learned by the Monte Carlo agent.
</div>

Code and full notebook on [GitHub](https://github.com/comoxx/RL_TextFlappyBird).
