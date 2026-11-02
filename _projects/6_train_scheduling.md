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

**The yard**

The yard has three areas (reception, formation, departure) and three machines. The splitting machine (*débranchement*) breaks an arriving train into wagons. The formation machine assembles a departure train from wagons of several arriving trains. The last machine (*dégarage*) moves the formed train to the departure tracks. Agents do the manual tasks in between.

**Method**

Time is cut into 15-minute slots indexed by $j$. A train is identified by its train number and its day. For each machine $m$, train $i$ and slot $j$, a binary variable $x^m_{i,j}$ is 1 if the task starts at slot $j$. Each machine handles at most one train per slot, and each train goes through each machine exactly once:

$$\sum_i x^m_{i,j} \le 1 \quad \forall j, \qquad \sum_j x^m_{i,j} = 1 \quad \forall i.$$

With $t(x) = \sum_j j \, x_{i,j}$ the start time of a task, the main timing rules from SNCF are:

$$t(x^{\text{DEB}}_i) \ge a_i + 60, \qquad t(x^{\text{FOR}}_{i'}) \ge t(x^{\text{DEB}}_i) + 15 \quad \forall i \in C(i'),$$

$$t(x^{\text{DEG}}_{i'}) \ge t(x^{\text{FOR}}_{i'}) + 165, \qquad t(x^{\text{DEG}}_{i'}) \le d_{i'} - 35,$$

in minutes, where $a_i$ is the arrival time of train $i$, $d_{i'}$ the departure time of train $i'$, and $C(i')$ the arriving trains that send wagons to $i'$. Unavailable slots are forced to zero.

In milestone 2 we added integer variables for the number of busy tracks in each area at each slot. For the reception area it follows a simple recurrence: a track is taken when a train arrives and freed when it is split,

$$N^{\text{REC}}_j = N^{\text{REC}}_{j-1} + \sum_i \left( A_{i,j} - x^{\text{DEB}}_{i,j-1} \right),$$

where $A_{i,j} = 1$ if train $i$ arrives at slot $j$. The formation area is harder, since a departure train holds a track from its first split wagon until it leaves. Linearizing products of binaries created too many variables, so we used a second recurrence instead. The objective is to minimize the peak use of the formation area: $\min z$ subject to $z \ge N^{\text{FOR}}_j$ for all $j$.

In milestone 3 the machine variables are replaced by task variables $y_{k,i,j}$ (shift $k$ does a given task on train $i$ at slot $j$), and integer variables $n_{k,d}$ count the agents of shift $k$ starting at $d$. Constraints cover skills, unavailability and staffing limits. The objective is the total number of working days, $\min \sum_{k,d} n_{k,d}$.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/sncf-title.jpg" title="Final presentation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Results**

Three instances were provided: a mini case, a simple case and a realistic one. Times are Gurobi solve times from our final presentation.

| Instance | Mini | WPY simple | WPY realistic |
|---|---:|---:|---:|
| Arriving trains | 3 | 18 | 111 |
| Departing trains | 3 | 18 | 106 |
| **Milestone 1**: binary variables | 459 | 34,000 | 279,000 |
| Milestone 1: solve time | 0.1 s | 0.7 s | 10.8 s |
| **Milestone 2**: variables | 766 | 47,000 | 370,000 |
| Milestone 2: solve time | 0.4 s | 16 s | 1,820 s |
| Milestone 2: peak formation use | 100% | 5% | 32.5% (13 of 40 tracks) |
| **Milestone 3**: variables | 350 | 500,000 | 3.5 M |
| Milestone 3: solve time | 5 s | 10 min | 5 min |
| Milestone 3: working days | 3 | 27 | 162 (not optimal) |

All instances of milestone 1 were sorted with no late departure. The repository README reports another run on an Intel i7-8750H: 7.1 s for milestone 1 on the large instance, 13 formation tracks in 1,873 s for milestone 2, and 19 working days (simple) and 264 (realistic, not optimal) for milestone 3.

**What was hard**

- Gurobi returned binaries like 0.999997 instead of 1, and a time window that ended exactly at the last departure sometimes made the model infeasible. Inequalities instead of equalities helped.
- In milestone 3, building the model took too long, and Gurobi ran out of memory. We rewrote constraints as recurrences and dropped the formation track constraint, then checked the track count after solving.
- For the realistic instance we tried two heuristics: fixing the machine times from milestone 2, or solving groups of trains one by one and joining the schedules.

A Tkinter visualizer replays each schedule and shows how busy each area is. Travel time of agents between areas is not modeled.

*Group project with Fret SNCF, CentraleSupélec, 2024. [Code on GitHub](https://github.com/comoxx/Passenger-Transport-Optimization).*
