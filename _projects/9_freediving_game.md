---
layout: page
title: Freediving game
description: A pygame freediving game where your real breath hold is the timer.
img: assets/img/projects/thumbs/freediving.jpg
importance: 3
category: personal
github: https://github.com/comoxx/FreedivingGame
---

A small pygame game about freediving, a sport I practice.

In Play mode the dive lasts as long as you can really hold your breath.

There is no oxygen bar in this mode. Enter kicks down, Space turns around, and at the surface the game asks whether you made it. You only have 30 fin kicks per dive, so spending them too early leaves you stuck deep. Around 20 m you become negatively buoyant and sink on your own, which saves energy on the way down. Explore mode adds a virtual oxygen bar, for when you would rather look at the fish.

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/freediving.png" title="Start screen" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Before the dive**

Freedivers relax before a breath hold, so the game starts with a breathing screen. It guides a box-breathing cycle: inhale, hold, exhale and pause, 5 seconds each. A dot runs along the sides of a square and a circle grows and shrinks with the breath. When you are ready, Space starts a 10-second countdown that also recalls the controls.

**How the diver moves**

The diver is a body in water with three forces: buoyancy, drag and the fin kick. At each frame (60 per second) the game adds them and updates the speed and depth. A kick is only possible every half second, and it pushes in the direction the diver faces.

Buoyancy follows real physics. The body is split into a fixed volume and the lungs. The air in the lungs is compressed with depth, following Boyle's law, with pressure rising by about 1 bar every 10 m:

$$V_{\text{lungs}}(h) = \frac{V_0}{1 + h/10}.$$

As the lungs shrink, the diver gets denser than sea water and starts to sink. With the values in the game (70 kg, 66 L of fixed volume, 8 L of lungs, sea water at 1020 kg/m³), the switch happens near 20 m, as in real freediving. Turning around resets the speed to zero, so the way back up costs kicks too.

**The world**

The screen follows the diver down to 80 m with a parallax background. Fish appear at random, and each species has its own depth range. Small fish and globe fish swim near the surface, dart fish and sharks appear from 10 m, and big fish only below 60 m. In Explore mode the oxygen bar drops over time and with every kick. The game saves your deepest dive in each mode as a record.

Made with Python and pygame. A Windows executable is also in the repository. [Code on GitHub](https://github.com/comoxx/FreedivingGame).
