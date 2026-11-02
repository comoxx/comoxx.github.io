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

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/traffic-spacetime.png" title="Space-time diagram" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Space-time diagram of a Nagel–Schreckenberg simulation. Time goes down, the road goes right. Red is stopped cars, green is fast cars. Jams form at random and move backward.
</div>


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

Lower speed limits and fewer trucks reduce emissions, and free-flowing traffic pollutes less than synchronized traffic.
