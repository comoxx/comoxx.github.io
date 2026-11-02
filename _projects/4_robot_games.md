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

In a survey after one workshop, all 14 high-school learners said they liked the game.

We built games that make students and young people want to learn robotics and control. Each game mixes image processing, control loops and pattern recognition, all in Python. Both games were published in 2024.

**Delivery Race Game**

A human drives a DJI RoboMaster EP with a joypad. They race an autonomous RoboMaster that fetches two tennis balls, one at a time, and drops them in a basket. The autonomous robot uses only its onboard camera, so the game needs no motion capture and can travel to schools.

Each camera frame is converted to HSV, which is more robust to lighting than RGB. A color threshold keeps the ball's pixels, and the largest contour gives the ball center $$x_s$$ and radius $$r_s$$ on screen. With the screen width $w$, the camera angle $$\theta_{\max}$$, the focal length $f$ and the real ball radius $$r_0$$, the robot estimates the ball position:

$$\theta = \theta_{\max}\left(\frac{x_s}{w} - \frac{1}{2}\right), \qquad L = f\,\frac{r_0}{r_s}, \qquad x_0 = L\cos\theta, \quad y_0 = L\sin\theta.$$

This estimate is rough, since the camera is not at the robot's center. A discrete PI controller on each axis corrects the error $\epsilon$, with $$T_s = 0.1$$ s:

$$v[kT_s] = K_P\,\epsilon[kT_s] + K_I\,T_s \sum_{j=1}^{k} \epsilon[jT_s].$$

We aimed for a static error below 1 cm and no overshoot on $x$. Once it holds the ball, the robot finds the basket by its DJI vision marker and drives to it with the same PI scheme. In the workshop, children tune $$K_P$$ and $$K_I$$ in a small GUI and watch how the robot reaches the marker.

**DroPong**

This is Pong played with real robots. Two DJI RoboMaster S1 are the paddles and a DJI Tello Talent drone is the ball. They play in the CentraleSupélec flight arena, where an OptiTrack system tracks each robot. The software runs on ROS. In this version the drone flies at a constant altitude with no feedback loop.

**Results**

Survey after the Delivery Race workshop at the OSER student fair (14 high-school learners, 8 of them girls):

| Question | Yes |
|---|---:|
| Did you like the game? | 100% |
| Did the workshop help you understand basic programming notions? | 100% |
| Did the workshop help you learn about image processing? | 90% |
| Did the workshop help you learn about robotics and control? | 90% |
| Would you like to know more about these topics? | 100% |

The answers were very positive, but 14 learners is a small group. DroPong workshops in 2023 reached about 120 participants, from teenagers at OSER to 8-year-olds at the Fête de la Science.

{% bibliography --query @*[key=hanne2024delivery || key=bertrand2024dropong] %}
