---
layout: page
title: Educational robot games
description: Games with ground robots and drones that teach control and computer vision. Two published papers.
img: assets/img/projects/thumbs/robot-games.jpg
importance: 2
category: research
related_publications: true
---

Project at the Laboratoire des Signaux et Systèmes (L2S), CentraleSupélec, from February 2023 to July 2024.

We built games that make students and young people want to learn robotics and control. Each game mixes image processing, control loops and pattern recognition, all in Python.

- **Delivery Race Game.** A human drives a DJI RoboMaster EP with a keyboard or gamepad. They race an autonomous RoboMaster that finds and delivers tennis balls using vision markers and a PI controller.
- **DroPong.** The Pong game played with real aerial and ground drones.

Both games were published in 2024.

**Delivery Race Game: method**

Each robot must fetch two tennis balls, one at a time, and drop them in a basket. The player drives robot A with a joypad. Robot B runs on its own, using only its onboard camera, so the game needs no motion capture and can travel to schools.

1. **Ball detection.** Each camera frame is converted to HSV, which is more robust to lighting than RGB. A color threshold keeps the ball's pixels, and the largest contour is kept if it is big enough.
2. **Position estimate.** From the ball center $x_s$ and radius $r_s$ on screen (in pixels), the screen width $w$, the camera angle $\theta_{\max}$, the focal length $f$ and the real ball radius $r_0$:

   $$\theta = \theta_{\max}\left(\frac{x_s}{w} - \frac{1}{2}\right), \qquad L = f\,\frac{r_0}{r_s}, \qquad x_0 = L\cos\theta, \quad y_0 = L\sin\theta.$$

   This estimate is rough, since the camera is not at the robot's center.
3. **PI control.** A discrete PI controller corrects these errors. With $\epsilon[kT_s]$ the distance to the target and $T_s = 0.1$ s:

   $$v[kT_s] = K_P\,\epsilon[kT_s] + K_I\,T_s \sum_{j=1}^{k} \epsilon[jT_s].$$

   There is one controller per axis. The specifications were a static error below 1 cm and no overshoot on $x$.
4. **Delivery.** The robot grabs the ball, finds the basket by its DJI vision marker and drives to it with the same PI scheme.

In the workshop, children tune the $K_P$ and $K_I$ gains in a small GUI and watch how the robot reaches the marker.

**DroPong: method**

Two DJI RoboMaster S1 robots are the paddles and a DJI Tello Talent drone is the ball. They play in the CentraleSupélec flight arena (10 m × 5 m × 3 m), where an OptiTrack motion capture system tracks reflective markers on each robot. The software runs on ROS, with an RViz simulator for tests. A paddle can be driven by the computer, a joypad or the DJI phone app. In this version the drone flies at a constant altitude and gets velocity references with no feedback loop. 3D bounces and a feedback controller were planned next.

**Results**

Survey after the Delivery Race workshop at the OSER student fair (14 high-school learners, 8 of them girls):

| Question | Yes |
|---|---:|
| Did you like the game? | 100% |
| Did the workshop help you understand basic programming notions? | 100% |
| Did the workshop help you learn about image processing? | 90% |
| Did the workshop help you learn about robotics and control? | 90% |
| Would you like to know more about these topics? | 100% |

DroPong workshops in 2023 reached about 120 participants:

| Event | Audience |
|---|---|
| OSER closing day, May 2023 | 2 groups of 25 teenagers |
| High-school visit, May 2023 | 1 group of 20 teenagers |
| Fête de la Science, October 2023 | about 50 children aged 8 (22 and 26 survey answers) |

**Lessons**

Teaching all the basics of control to mixed groups of beginners was too ambitious. It worked better to show how control solves one problem in the game. Children liked playing against the robot most, so letting several of them play was worth the time. Quantitative feedback was hard to get in 30-minute visits.

{% bibliography --query @*[key=hanne2024delivery || key=bertrand2024dropong] %}
