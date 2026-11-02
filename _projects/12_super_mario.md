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

On World 1-2, a level it never saw in training, our recurrent agent scores 60% more than a memoryless PPO agent.

**Setup**

We study whether an agent can adapt to physics it cannot observe. The environment is built on `gym-super-mario-bros`. At the start of every episode, we patch two RAM addresses of the NES emulator. One sets the gravity, the other the jump impulse. Both are integers drawn uniformly, gravity between 41 and 49 and jump speed between 0 and 4. The agent only sees pixels, as a stack of the last four 84 × 84 grayscale frames. It never sees the physics values, so the task becomes a partially observable problem. To play well, it has to work out which universe it is in while it plays. We also subtract a small time penalty from the game reward to push for speed.

A policy without memory can only learn an average behavior across all universes. To infer the physics, the policy needs the history of observations and actions. An LSTM state is a compact summary of this history. This is the idea behind [RL²](https://arxiv.org/abs/1611.02779) (Duan et al., 2016).

We trained two agents on World 1-1 with 7 discrete actions and the same PPO hyperparameters. The first one is plain PPO with a Nature-CNN encoder and no memory. The second one is recurrent PPO, with the same encoder followed by a 256-unit LSTM. Actor and critic have separate LSTMs, and the hidden state is reset between episodes. The recurrent agent uses a smaller batch so that LSTM sequences stay intact.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mario-loop.png" title="Meta-RL loop" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The meta-RL setup. The inner loop plays one universe, the outer loop trains across a distribution of universes.
</div>

**Results**

On World 1-1, both agents improve fast in the first 2M steps. The recurrent agent pulls ahead after about 6M steps. Episode lengths stay close, so the gap comes from better play rather than longer survival.

We then ran both agents on World 1-2, an underground level neither had seen, with random physics (15 episodes each):

| Agent | Mean reward | Mean steps | Levels finished |
|---|---:|---:|---:|
| PPO | 779.6 ± 301.7 | 127.3 | 0/15 |
| **Recurrent PPO** | **1250.1 ± 362.9** | 128.3 | 0/15 |

The recurrent agent scores much higher with almost the same survival time. Neither finishes the level. The CNN memorized the layout of World 1-1, so this is physical generalization, not spatial. Training on several levels would be needed for the second kind.

To see what the LSTM encodes, we collected its hidden state at step 100 in 500 episodes with different physics and projected it with t-SNE. The points form clusters mainly by jump speed, with a smooth gradient for gravity inside each cluster. So within the first 100 steps, the network has built an internal estimate of the physics.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mario-tsne.png" title="t-SNE of the LSTM state" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The LSTM hidden state, colored by gravity and by jump speed.
</div>

*Reinforcement learning course, CentraleSupélec, 2026. With Ayoub El Kbadi and Etienne Maugars.*
