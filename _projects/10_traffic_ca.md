---
layout: page
title: Traffic with cellular automata
description: Modeling road traffic with cellular automata to study how to reduce pollution.
img: assets/img/projects/thumbs/traffic.jpg
importance: 4
category: personal
---

My TIPE research project in preparatory class (2022): *Traffic modeling using cellular automata. How can we reduce road pollution?*

I wrote a discrete traffic simulator, compared two models in it, and used it to estimate CO₂ emissions under different speed limits.

The road is a circular line of cells, so cars that leave on the right come back on the left. A cell is either empty or holds part of a vehicle. Each vehicle has a position, a speed and a type, car or truck. A model is judged on its fundamental diagram, the flow against the density. Real traffic shows three regimes on it: free flow, synchronized flow and jams.

**Two models**

The Nagel–Schreckenberg model uses simple stochastic rules: accelerate, brake to avoid collisions, slow down at random, move. I ran it with a road of 1000 cells, one cell per vehicle and 1000 iterations. Jams appear on their own, but there is no synchronized regime. One vehicle per cell is too coarse, and braking is almost instant.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/traffic-spacetime.png" title="Space-time diagram" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Space-time diagram of a Nagel–Schreckenberg simulation. Time goes down, the road goes right. Red is stopped cars, green is fast cars. Jams form at random and move backward.
</div>

The Brake Light Model adds brake lights, driver anticipation, reaction times and vehicles longer than one cell. A driver who sees the brake light ahead is more likely to slow down. Each driver also anticipates the speed of the car ahead when computing the safe gap. I used vehicles of 5 cells on a road of 7500 cells. Vehicles follow each other more closely without crashing, and the synchronized regime appears.

**Emissions**

The emissions of each vehicle at each step come from an empirical regression on its speed and acceleration, taken from the literature. Trucks have a lower maximum speed and their own formula.

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

Lower speed limits and fewer trucks reduce emissions, and free-flowing traffic pollutes less than synchronized traffic. In my runs the synchronized regime was the most polluting one. These conclusions are qualitative and read from the simulation plots.
