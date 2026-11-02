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

**Environment**

Text Flappy Bird comes in two versions. The screen version returns the full grid, which is far too large for a table. I used `TextFlappyBird-v0`, whose observation is only the horizontal and vertical distance from the bird to the center of the next pipe gap. That gives 308 discrete states and two actions (flap or do nothing). The reward is +1 per step survived, and a pipe is passed every 10 steps or so. A random agent passes 0.14 pipes per episode on average and rarely leaves its starting area.

**Method**

Both agents start from an empty Q-table and act $\epsilon$-greedily. $\epsilon$ starts at 1.0 and is multiplied by 0.9995 after each episode, down to 0.01. The discount is $\gamma = 0.99$, and each agent trains for 10,000 episodes. With a fixed $\epsilon = 0.1$, the Monte Carlo agent got stuck around 8 pipes, so the decay matters.

*Every-visit Monte Carlo.* The agent plays a full episode, then walks back through it and computes the return at each step:

$$
G_t = r_{t+1} + \gamma\, G_{t+1}.
$$

Every visit to $(s, a)$ moves its value toward the observed return, with a step size of one over the visit count $N(s,a)$:

$$
Q(s,a) \leftarrow Q(s,a) + \frac{1}{N(s,a)} \big( G_t - Q(s,a) \big).
$$

*SARSA(λ).* This agent learns at every step. It computes the TD error with the next action it actually takes:

$$
\delta_t = r_{t+1} + \gamma\, Q(s_{t+1}, a_{t+1}) - Q(s_t, a_t).
$$

Eligibility traces send this error back to recently visited pairs. I used replacing traces, $e(s_t, a_t) \leftarrow 1$, so that a loop through the same state cannot blow the trace up. Then, for every pair with a non-zero trace:

$$
Q(s,a) \leftarrow Q(s,a) + \alpha\, \delta_t\, e(s,a), \qquad e(s,a) \leftarrow \gamma \lambda\, e(s,a).
$$

The main run uses $\alpha = 0.1$ and $\lambda = 0.9$.

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

After training, I set $\epsilon = 0$ and ran each greedy policy for 200 episodes, capped at 2,000 steps (199 pipes). Convergence is the first episode where the 200-episode rolling mean stays above 50 pipes for 100 episodes.

| Agent | Greedy reward | Greedy score (pipes) | Convergence to 50 pipes |
|---|---:|---:|---:|
| Every-visit Monte Carlo | 2000.00 | 199.00 | episode 7,707 |
| SARSA(λ) | 1990.20 | 198.02 | episode 8,075 |
| Random baseline | 11.14 | 0.14 | |

Monte Carlo never crashed in 200 greedy episodes. SARSA(λ) crashed early in a few of them. Monte Carlo also reached every training milestone first, and only Monte Carlo held a rolling mean above 100 pipes (from episode 8,756). It was also much cheaper to run: 26 seconds for 10,000 episodes, against 11 min 39 s for SARSA(λ), which updates every traced pair at every step. One explanation for the slower SARSA curve is that it is on-policy. It learns the value of the $\epsilon$-greedy policy, so it plays more carefully around its own random moves.

**Parameter sweep.** I trained SARSA(λ) for 3,000 episodes on a grid of $\alpha$ and $\lambda$ and scored the greedy policy on 100 episodes. Results were very uneven. Both $(\alpha = 0.3, \lambda = 0)$ and $(\alpha = 0.05, \lambda = 0.6)$ reached the 199-pipe cap. But $\lambda = 0.99$ gave 11 pipes or fewer for every $\alpha \geq 0.1$. A large step size combined with a long trace makes the updates too noisy.

**Generalization.** Both agents were trained on height 15, width 20 and a pipe gap of 4, then tested on new settings without retraining (mean pipes over 200 greedy episodes).

| Test setting | Monte Carlo | SARSA(λ) |
|---|---:|---:|
| Training setting (gap 4) | 199.00 | 195.27 |
| Larger gap (6) | 199.00 | 199.00 |
| Smaller gap (2) | 0.36 | 2.50 |
| Taller screen (height 20) | 36.38 | 35.45 |

A larger gap only produces states the agents already know. A smaller gap or a taller screen creates distances that were never visited. Their Q-values are still zero, so the agents act at random and crash. A tabular agent memorizes coordinates and does not learn the physics. Handling the screen version or the original game would need function approximation, such as a DQN.

Code and full notebook on [GitHub](https://github.com/comoxx/RL_TextFlappyBird).
