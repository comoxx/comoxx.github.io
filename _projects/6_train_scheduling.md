---
layout: page
title: Freight yard optimization with SNCF
description: Scheduling machines, tracks and staff in a freight marshalling yard with mixed-integer programming.
img: assets/img/projects/thumbs/sncf.jpg
importance: 15
category: coursework
github: https://github.com/comoxx/Passenger-Transport-Optimization
---

On the realistic instance with 111 arriving trains, the machine schedule took 10.8 s to solve with no late departure.

In a freight marshalling yard, trains arrive, are split into wagons, and new trains are built for departure. Machines, tracks and staff are all limited. With Fret SNCF, we turned the yard into mixed-integer programs solved with Gurobi, one milestone at a time.

| Milestone | Decides | Goal |
|---|---|---|
| 1. Machines | a time slot for every task on every machine | no train leaves late |
| 2. Tracks | how wagons use the reception, formation and departure tracks | use as few tracks as possible |
| 3. Staff | which agent does which task | as few working shifts as possible |

The yard has three areas (reception, formation, departure) and three machines. The splitting machine (*débranchement*) breaks an arriving train into wagons. The formation machine assembles a departure train from wagons of several arriving trains. The last machine (*dégarage*) moves the formed train to the departure tracks.

**Method**

Time is cut into 15-minute slots. For each machine $m$, train $i$ and slot $j$, a binary variable $$x^m_{i,j}$$ is 1 if the task starts at slot $j$. Each machine handles at most one train per slot, and each train goes through each machine once. With $t(x)$ the start time of a task, the main timing rules from SNCF are, in minutes:

$$t(x^{\text{DEB}}_i) \ge a_i + 60, \qquad t(x^{\text{FOR}}_{i'}) \ge t(x^{\text{DEB}}_i) + 15 \quad \forall i \in C(i'),$$

$$t(x^{\text{DEG}}_{i'}) \ge t(x^{\text{FOR}}_{i'}) + 165, \qquad t(x^{\text{DEG}}_{i'}) \le d_{i'} - 35.$$

Here $$a_i$$ is the arrival time of train $i$, $$d_{i'}$$ the departure time of train $$i'$$, and $$C(i')$$ the arriving trains that send wagons to $$i'$$.

In milestone 2 we added integer variables $$N_j$$ for the number of busy tracks in each area at each slot, computed by recurrences. The objective is to minimize the peak use of the formation area, $$\min z$$ with $$z \ge N^{\text{FOR}}_j$$ for all $j$. In milestone 3, task variables say which shift does each task, and the objective is the total number of working days. Gurobi ran out of memory on this one, so we rewrote constraints as recurrences and added heuristics for the realistic instance. A Tkinter visualizer replays each schedule and shows how busy each area is.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sncf-title.jpg" title="Final presentation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Results**

| Instance | Mini | WPY simple | WPY realistic |
|---|---:|---:|---:|
| Arriving trains | 3 | 18 | 111 |
| Milestone 1: solve time | 0.1 s | 0.7 s | 10.8 s |
| Milestone 2: solve time | 0.4 s | 16 s | 1,820 s |
| Milestone 2: peak formation use | 100% | 5% | 32.5% (13 of 40 tracks) |
| Milestone 3: solve time | 5 s | 10 min | 5 min |
| Milestone 3: working days | 3 | 27 | 162 (not optimal) |

Times are Gurobi solve times from our final presentation. Milestones 1 and 2 scale to the realistic case, while milestone 3 only gives a non-optimal staff plan there.

*Group project with Fret SNCF, CentraleSupélec, 2024. [Code on GitHub](https://github.com/comoxx/Passenger-Transport-Optimization).*
