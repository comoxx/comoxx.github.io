---
layout: page
title: Traffic with cellular automata
description: Modeling road traffic with cellular automata to study how to reduce pollution.
img: assets/img/projects/thumbs/traffic.jpg
importance: 4
category: personal
---

My TIPE research project in preparatory class (2022): *Traffic modeling using cellular automata. How can we reduce road pollution?*

I wrote a discrete simulation engine and compared two models:

- **Nagel–Schreckenberg.** Simple stochastic rules: accelerate, brake to avoid collisions, slow down at random, move. It misses some traffic regimes, such as synchronized flow.
- **Brake Light Model.** Adds brake lights, driver anticipation, reaction times and vehicles longer than one cell. It reproduces synchronized flow and gives much more realistic traffic.

**Setup**

The road is a circular line of cells, so cars that leave on the right come back on the left. A cell is either empty or holds part of a vehicle. Time and space are discrete. Each vehicle has a position, a speed, a type (car or truck) and an ID. A model is judged on its fundamental diagram, the flow against the density. Real traffic shows three regimes on it: free flow, synchronized flow and jams.

With $N$ vehicles of length $L_{\text{veh}}$ cells on a road of $l$ cells, observed from $t_0$ to $t_0 + T$:

$$\rho = \frac{N L_{\text{veh}}}{l}, \qquad J = \frac{1}{T}\sum_{t=t_0}^{t_0+T} \frac{1}{N}\sum_{i=1}^{N} v_i(t) \cdot \rho.$$

**Nagel–Schreckenberg rules**

At each step, every vehicle with speed $v$ and gap $d$ to the vehicle ahead applies, in order:

1. Acceleration: $v \leftarrow \min(v+1, v_{\max})$.
2. Braking: if $d < v$, then $v \leftarrow d - 1$.
3. Random slowdown: with probability $p$, $v \leftarrow \max(v-1, 0)$.
4. Movement: $x \leftarrow x + v$.

I ran it with $v_{\max} = 5$, $p = 0.2$, a road of 1000 cells, one cell per vehicle and 1000 iterations. Jams appear on their own, but there is no synchronized regime. One vehicle per cell is too coarse, and braking is almost instant.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/traffic-spacetime.png" title="Space-time diagram" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Space-time diagram of a Nagel–Schreckenberg simulation. Time goes down, the road goes right. Red is stopped cars, green is fast cars. Jams form at random and move backward.
</div>

**Brake Light Model rules**

Vehicle $n$ now sees the brake light $b_{n+1}$ of the vehicle ahead. Its time headway is $t_h = d_n / v_n$, compared with a constant $t_s = 6$ s. The random braking probability depends on the situation:

$$p_n = \begin{cases} p_a = 0.94 & \text{if } b_{n+1} = 1 \text{ and } t_h < t_s, \\ p_0 = 0.5 & \text{if } v_n = 0, \\ p_b = 0.1 & \text{otherwise.} \end{cases}$$

Then the vehicle accelerates, $v_n \leftarrow \min(v_n + 1, v_{\max})$, and brakes to an effective gap that anticipates the speed of the car ahead:

$$v_n \leftarrow \min\left(v_n, d_n^{\text{eff}}\right), \qquad d_n^{\text{eff}} = d_n + \max\left(\min(d_{n+1}, v_{n+1}) - g_{\text{safe}}, 0\right),$$

with a safety gap $g_{\text{safe}} \ge 1$. With probability $p_n$ it slows down by one and turns its brake light on. Finally it moves, $x_n \leftarrow x_n + v_n$. I used $v_{\max} = 20$, $L_{\text{veh}} = 5$ cells, $g_{\text{safe}} = 2$, a road of 7500 cells and 1000 iterations. Vehicles follow each other more closely without crashing, and the synchronized regime appears.

**Emissions**

The emissions of vehicle $i$ at time $t$ come from an empirical non-linear regression on its speed $v$ and acceleration $a$:

$$E(i,t) = \max\left(0, \, f_1 v + f_2 v^2 + f_3 a^2 + f_4 v a\right),$$

with $f_1 = 3.13 \times 10^{-4}$, $f_2 = -1.84 \times 10^{-5}$, $f_3 = 7.5 \times 10^{-4}$ and $f_4 = 3.78 \times 10^{-4}$. Trucks have a lower maximum speed and their own six-term formula, with a constant, $v$, $v^2$, $a$, $a^2$ and $va$ terms.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/traffic-blm.png" title="" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/traffic-emissions.png" title="" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: flow against density in the Brake Light Model, with free, synchronized and jammed traffic. Right: CO₂ emissions against density for three speed limits.
</div>

**Results**

Lower speed limits and fewer trucks reduce emissions, and free-flowing traffic pollutes less than synchronized traffic. In my runs the synchronized regime was the most polluting one. These conclusions are qualitative and read from the simulation plots. The emission coefficients come from regressions published in the literature, not from my own measurements.
