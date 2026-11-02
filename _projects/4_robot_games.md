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

{% bibliography --query @*[key=hanne2024delivery || key=bertrand2024dropong] %}
