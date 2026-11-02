---
layout: page
title: Freight yard optimization with SNCF
description: Scheduling machines, tracks and staff in a freight marshalling yard with mixed-integer programming.
img: assets/img/projects/thumbs/sncf.jpg
importance: 15
category: coursework
github: https://github.com/comoxx/Passenger-Transport-Optimization
---

In a freight marshalling yard, trains arrive, are split into wagons, and new trains are built for departure. Machines, tracks and staff are all limited. With Fret SNCF, we turned the yard into mixed-integer programs solved with Gurobi, one milestone at a time.

| Milestone | Decides | Goal |
|---|---|---|
| 1. Machines | a time slot for every task on every machine | no train leaves late |
| 2. Tracks | how wagons use the reception, formation and departure tracks | use as few tracks as possible |
| 3. Staff | which agent does which task | as few working shifts as possible |

Instances went from a small test case to a realistic one. The last milestone ran Gurobi out of memory, so we rewrote constraints and added heuristics to keep it solvable. A Tkinter visualizer replays each schedule and shows how busy each area is.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sncf-title.jpg" title="Final presentation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

*Group project with Fret SNCF, CentraleSupélec, 2024. [Code on GitHub](https://github.com/comoxx/Passenger-Transport-Optimization).*
