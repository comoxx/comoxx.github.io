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

**Setup**

We study whether an agent can adapt to physics it cannot observe. At the start of every episode we patch two RAM addresses of the NES emulator (built on `gym-super-mario-bros`). One sets the gravity, the other the jump impulse. Both are integer RAM values drawn uniformly: gravity $g \in [41, 49]$ and jump speed $j \in [0, 4]$. The agent only sees pixels and never the physics vector, so the task becomes a partially observable problem. To play well, it has to work out which universe it is in while it plays.

**Formulation**

We model each universe as a POMDP whose state contains a hidden variable $z = (g, j) \sim \mathcal{U}(Z)$. It is constant within an episode. The observation is a stack of the last four $84 \times 84$ grayscale frames, and a time penalty $\lambda = 0.1$ is subtracted from the game reward to push for speed:

$$o_t = \{\text{img}_t, \text{img}_{t-1}, \text{img}_{t-2}, \text{img}_{t-3}\}, \qquad r_t = r_t^{\text{Mario}} - \lambda.$$

The meta-objective is the expected return over the whole distribution of universes:

$$J(\pi) = \mathbb{E}_{z \sim Z,\; \tau \sim \pi} \left[ \sum_{t=0}^{T} \gamma^t r_t \right].$$

A single memoryless policy can only learn an average behavior across all $z$. To infer $z$, the policy must depend on the history $h_t = (o_{1:t}, a_{1:t-1})$, so that $a_t \sim \pi(a_t \mid h_t)$. An LSTM state is a compact summary of this history.

**Agents**

We trained two agents on World 1-1, with 7 discrete actions:

- **PPO**, with a Nature-CNN encoder (convolutions with 32, 64 and 64 filters) and no memory.
- **Recurrent PPO**, with the same encoder followed by a 256-unit LSTM, following [RL²](https://arxiv.org/abs/1611.02779) (Duan et al., 2016). Actor and critic have separate LSTMs. The hidden state is reset between episodes.

Both use the PPO clipped objective

$$L^{\text{CLIP}}(\theta) = \mathbb{E}_t \left[ \min\left( \rho_t(\theta) \hat{A}_t,\; \text{clip}(\rho_t(\theta), 1-\epsilon, 1+\epsilon) \hat{A}_t \right) \right], \qquad \rho_t(\theta) = \frac{\pi_\theta(a_t \mid h_t)}{\pi_{\theta_\text{old}}(a_t \mid h_t)},$$

with the same hyperparameters: $\epsilon = 0.1$, $\gamma = 0.9$ (episodes are short), entropy coefficient 0.02, learning rate $10^{-4}$, rollouts of 512 steps and 4 epochs per update. The recurrent agent uses 16 parallel environments instead of 10, and a batch of 512 instead of 1024 so that LSTM sequences stay intact.

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

| Agent | Mean reward | Best reward | Mean steps | Levels finished |
|---|---:|---:|---:|---:|
| PPO | 779.6 ± 301.7 | 1792.2 | 127.3 | 0/15 |
| **Recurrent PPO** | **1250.1 ± 362.9** | **1837.7** | 128.3 | 0/15 |

The recurrent agent scores 60% more on average, with almost the same survival time. Neither finishes the level. The CNN memorized the layout of World 1-1, so this is physical generalization, not spatial.

To check what the LSTM encodes, we collected its hidden state $h_{100}$ at step 100 in 500 episodes with different $(g, j)$ and projected it with t-SNE. The points form clusters mainly by jump speed, with a smooth gradient for gravity inside each cluster. So within the first 100 steps, the network has built an internal estimate of the physics.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/mario-tsne.png" title="t-SNE of the LSTM state" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The LSTM hidden state, colored by gravity and by jump speed.
</div>

**Limits**

Training used a single level, which explains the failure on World 1-2. Training on several levels, or on generated ones, would be needed for spatial generalization. The CNN is also learned from scratch together with the physics inference, which costs many samples. A pretrained visual encoder would likely speed things up.

*Reinforcement learning course, CentraleSupélec, 2026. With Ayoub El Kbadi and Etienne Maugars.*
