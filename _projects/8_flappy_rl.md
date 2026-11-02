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

After training, both greedy agents pass about 198 pipes or more per episode, close to the 199-pipe cap.

**Method**

I used `TextFlappyBird-v0`, whose observation is the horizontal and vertical distance from the bird to the center of the next pipe gap. That gives 308 discrete states and two actions, flap or do nothing. The reward is +1 per step survived. A random agent passes 0.14 pipes per episode on average.

Both agents start from an empty Q-table and act $\epsilon$-greedily. $\epsilon$ starts at 1.0 and decays to 0.01. Each agent trains for 10,000 episodes. With a fixed $\epsilon = 0.1$, the Monte Carlo agent got stuck around 8 pipes, so the decay matters. The Monte Carlo agent is every-visit. SARSA(λ) uses replacing traces, with $\alpha = 0.1$ and $\lambda = 0.9$.

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

**Results**

I ran each greedy policy for 200 episodes, capped at 2,000 steps (199 pipes).

| Agent | Greedy score (pipes) | Convergence to 50 pipes | Training time |
|---|---:|---:|---:|
| Every-visit Monte Carlo | 199.00 | episode 7,707 | 26 s |
| SARSA(λ) | 198.02 | episode 8,075 | 11 min 39 s |
| Random baseline | 0.14 | | |

Monte Carlo never crashed and reached every training milestone first. It was also much cheaper, since SARSA(λ) updates every traced pair at every step. A sweep over $\alpha$ and $\lambda$ for SARSA(λ) gave very uneven results. With $\lambda = 0.99$, every $\alpha \geq 0.1$ gave 11 pipes or fewer.

I then tested both agents on new settings without retraining.

| Test setting | Monte Carlo | SARSA(λ) |
|---|---:|---:|
| Training setting (gap 4) | 199.00 | 195.27 |
| Larger gap (6) | 199.00 | 199.00 |
| Smaller gap (2) | 0.36 | 2.50 |
| Taller screen (height 20) | 36.38 | 35.45 |

A larger gap only produces states the agents already know. A smaller gap or a taller screen creates distances that were never visited, and their Q-values are still zero. A tabular agent memorizes coordinates, so the screen version would need function approximation.

Code and full notebook on [GitHub](https://github.com/comoxx/RL_TextFlappyBird).
