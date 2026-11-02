---
layout: page
title: Super Mario Multiverse
description: Meta-RL agents that adapt to random gravity and jump physics in Super Mario Bros.
img: assets/img/projects/thumbs/mario.jpg
importance: 4
category: coursework
---

<div class="row justify-content-sm-center">
    <div class="col-sm-7 mt-3 mt-md-0">
        {% include video.liquid path="assets/video/mario-multiverse.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true muted=true controls=true %}
    </div>
</div>
<div class="caption">
    Our trained recurrent agent finishing World 1-1 in one of the randomized universes (gravity 45, jump 2).
</div>

## Setup

We study whether an agent can adapt to physics it cannot observe. At the start of every episode we patch the NES emulator's RAM to draw a new gravity and a new jump strength. The agent only sees pixels. It never sees the physics values, so the task becomes a partially observable problem. To play well, it has to work out which universe it is in while it plays.

We trained two agents with the same hyperparameters for 10M steps on World 1-1:

- **PPO**, with no memory.
- **Recurrent PPO**, with an LSTM that can carry information across time, following [RL²](https://arxiv.org/abs/1611.02779) (Duan et al., 2016).

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mario-loop.png" title="Meta-RL loop" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The meta-RL setup. The inner loop plays one universe, the outer loop trains across a distribution of universes.
</div>

## Results

- The recurrent agent pulls ahead after about 6M steps.
- On World 1-2, a level neither agent had seen, it scores **60% more** (1250 vs 780 mean reward). Neither finishes the level, so this is physical generalization, not spatial.
- A t-SNE of the LSTM state shows clusters by gravity and jump speed within the first 100 steps. The network builds an internal estimate of the physics.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mario-tsne.png" title="t-SNE of the LSTM state" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The LSTM hidden state, colored by gravity and by jump speed.
</div>

*Reinforcement learning course, CentraleSupélec, 2026. With Ayoub El Kbadi and Etienne Maugars.*
