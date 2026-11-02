---
layout: page
title: Digital twin of a robot arm
description: A digital failure twin for reliability modeling and predictive maintenance of a robot.
img: assets/img/projects/thumbs/digital-twin.jpg
importance: 16
category: coursework
github: https://github.com/comoxx/digital_twin_robot_group2
---

Group project at CentraleSupélec, built on the course's [digital twin framework](https://github.com/sonic160/digital_twin_robot).

Our team finished 2nd of 9 in the course's Kaggle challenge on predicting robot failures from motor data.

The twin simulates the robot and its failures. We used it for condition monitoring, reliability modeling and predictive maintenance. The course ended with a [Kaggle challenge](https://www.kaggle.com/competitions/robot-predictive-maintenance) built on this data.

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/thumbs/digital-twin.jpg" title="Robot arm" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The robot arm modeled by the twin.
</div>

**The task**

The robot is a Hiwonder ArmPi FPV with six servo motors. A monitoring app records the position, temperature and voltage of each motor in real time. Each motor has a binary label at each time step, normal or faulty. The goal was to predict the six labels on a test set built by the other groups. Faults are rare, so the challenge used the F1-score of the faulty class instead of accuracy.

We split the work by motor. I handled motors 1 and 2, two teammates took two motors each, and one worked on preprocessing.

**Method**

Values outside a valid range were set to missing and forward-filled. Position and voltage went through a zero-phase Butterworth low-pass filter and a rolling mean. For each motor we then chose a few signals from a correlation matrix and many trials. The final sets often included the temperatures of other motors, not only the motor's own signals.

At each time step, the input is the last $W$ samples of these signals, kept every $s$ steps and flattened. We tried $W$ from 5 to 200 and $s$ from 1 to 20. We compared logistic regression, random forest and gradient boosting with balanced class weights, using 5-fold cross-validation on F1.

**Results**

| Motor | Model | Window $W$ / step $s$ | Test F1 |
|---|---|---|---:|
| 1 | Random forest | 100 / 2 | 0.758 |
| 2 | Logistic regression | 100 / 20 | 0.369 |
| 3 | Logistic regression | 100 / 20 | 0.268 |
| 4 | Logistic regression | 100 / 5 | 0.49 (public test set) |
| 5 | Random forest | 100 / 5 | 0.85 |
| 6 | Random forest | 100 / 10 | 0.337 |

Scores were very uneven across motors, and cross-validation scores also varied a lot between folds.

Code on [GitHub](https://github.com/comoxx/digital_twin_robot_group2).
