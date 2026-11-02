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

The twin simulates the robot and its failures. We used it for condition monitoring, reliability modeling and predictive maintenance.

The course ended with a [Kaggle challenge](https://www.kaggle.com/competitions/robot-predictive-maintenance) on predicting robot failures from motor data. Our team (Group 2) finished **2nd of 9**.

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/thumbs/digital-twin.jpg" title="Robot arm" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The robot arm modeled by the twin.
</div>

**The task**

The robot is a Hiwonder ArmPi FPV with six servo motors. A condition-monitoring app collects the position, temperature and voltage of each motor in real time. Training sequences covered the robot at rest, pick-and-place and single motors moving. Each motor has a binary label at each time step (normal or faulty). The goal was to predict the six labels on a test set built by the other groups.

Faults are rare, so a model that always predicts "normal" gets a high accuracy. The challenge used the F1-score of the faulty class instead:

$$F_1 = \frac{2PR}{P+R}, \qquad P = \frac{TP}{TP+FP}, \quad R = \frac{TP}{TP+FN}.$$

We split the work by motor. I handled motors 1 and 2, two teammates took two motors each, and one worked on preprocessing.

**Method**

1. **Cleaning.** Values outside a valid range were set to missing and forward-filled (position 0 to 1000, temperature 0 to 100, voltage 6000 to 8000, in the raw sensor units). Position and voltage went through a zero-phase 5th-order Butterworth low-pass filter (cutoff 0.5 Hz, sampling 10 Hz), then a rolling mean. Each signal was expressed relative to its first value in the sequence.
2. **Feature selection.** For each motor we chose a few signals from a correlation matrix and many trials. The final sets often included the temperatures of other motors, not only the motor's own signals.
3. **Sliding window.** At time $t$, the input is the last $W$ samples of the selected signals $z$, kept every $s$ steps and flattened:

   $$\mathbf{x}_t = \left[ z_{t-W+1}, \, z_{t-W+1+s}, \, \dots, \, z_t \right].$$

   We tried $W$ from 5 to 200 and $s$ from 1 to 20.
4. **Classifiers.** Logistic regression, random forest and gradient boosting, with standard scaling and balanced class weights. Each setting was scored by 5-fold cross-validation on F1.

**Results**

F1-score on the challenge test data for the final model of each motor.

| Motor | Model | Window $W$ / step $s$ | Test F1 |
|---|---|---|---:|
| 1 | Random forest (100 trees) | 100 / 2 | 0.758 |
| 2 | Logistic regression ($C = 1$) | 100 / 20 | 0.369 |
| 3 | Logistic regression ($C = 0.01$) | 100 / 20 | 0.268 |
| 4 | Logistic regression ($C = 1$) | 100 / 5 | 0.49 (public test set) |
| 5 | Random forest (100 trees) | 100 / 5 | 0.85 |
| 6 | Random forest (500 trees) | 100 / 10 | 0.337 |

Final ranking: **2nd of 9** teams.

**Notes**

Results were very uneven across motors. For motors 3 and 5 the labels showed no clear correlation with any signal. Motor 5 still reached the best score. Cross-validation scores also varied a lot between folds. On motor 1, a logistic regression with $W = 100$ scored $0.66 \pm 0.47$ across folds.

Code on [GitHub](https://github.com/comoxx/digital_twin_robot_group2).
