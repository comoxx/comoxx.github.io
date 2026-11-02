---
layout: page
title: Railway visual odometry
description: Metric localization of a train from a single camera, using the geometry of the track.
img: assets/img/projects/thumbs/railway.jpg
importance: 3
category: coursework
---

Joint work with Etienne Maugars for the Computer Vision course at CentraleSupélec (2026).

Trains need to know their speed and position, but GPS drops out in tunnels and mountains. We estimate both from a single front-facing RGB camera. Classical visual odometry has no metric scale with one camera. The railway provides it: the gap between the rails is always 1.435 m.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include video.liquid path="assets/video/railway-odometry.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true muted=true controls=true %}
    </div>
</div>
<div class="caption">
    Our pipeline on 25 seconds of the Nordlandsbanen recording: detected rails, bird's-eye view (top right), estimated speed against GPS, and heading. Footage: NRK.
</div>

**Pipeline.**

1. Detect the rails with a Hough transform on a trapezoidal region of interest, smoothed over time.
2. Compute a homography from the rail endpoints and warp the frame to a bird's-eye view (inverse perspective mapping).
3. Track the ground between frames in this view. The known gauge turns pixels into meters.

We evaluate on the [Nordlandsbanen](https://nrkbeta.no/2013/01/15/nordlandsbanen-minute-by-minute-season-by-season/) recording: a 10-hour, 729 km train journey through Norway, with coastal, mountain and tunnel sections. Ground-truth speed is recomputed from GPS. On the 4-minute clip this excerpt comes from, the estimated speed stays within 1.8 km/h of GPS on average, at around 90 km/h.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/railway-rails.png" title="Rail detection" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/railway-ipm.png" title="Bird's-eye view" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: detected rails. Right: the bird's-eye view used to measure motion.
</div>

