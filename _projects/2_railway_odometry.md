---
layout: page
title: Railway visual odometry
description: Metric localization of a train from a single camera, using the geometry of the track.
img: assets/img/projects/thumbs/railway.jpg
importance: 3
category: coursework
---

Joint work with Etienne Maugars for the Computer Vision course at CentraleSupélec (2026).

On a 16 km test sequence, our speed estimate has a correlation of 0.980 with GPS and a mean absolute error of 2.97 km/h.

Trains need to know their speed and position, but GPS drops out in tunnels and mountains. We estimate both from a single front-facing RGB camera. Classical visual odometry has no metric scale with one camera. The railway provides it: the track is a flat, known structure, and the gap between the rails is always 1.435 m. The camera height and angle also barely change, so the system can be calibrated once.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include video.liquid path="assets/video/railway-odometry.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true muted=true controls=true %}
    </div>
</div>
<div class="caption">
    Our pipeline on 25 seconds of the Nordlandsbanen recording: detected rails, bird's-eye view (top right), estimated speed against GPS, and heading. Footage: NRK.
</div>

**Method**

We crop a fixed trapezoid in front of the train, where the rails look straight, and enhance it with CLAHE. The rails are found with Canny edges and a probabilistic Hough transform. We keep only lines with a moderate slope, which drops sleepers and poles, and we smooth the endpoints over time.

The four rail endpoints then define a homography to a 400 × 400 bird's-eye view. We recompute it at every frame. This cancels the roll and pitch of the cab, so the rails stay vertical in the warped image.

In this view, we track Shi-Tomasi corners on the ballast and sleepers with Lucas-Kanade optical flow. The rails themselves are masked out, since motion along a line is ambiguous. The warp stretches the trapezoid into a square, so the gauge only fixes the lateral scale. For forward motion, we measured that the region covers 14.5 m of track. This gives a fixed vertical scale, and the speed follows from the median vertical flow $$\overline{\Delta v}$$ of the valid features:

$$S_y = \frac{14.5 \text{ m}}{400 \text{ px}} \approx 0.036 \text{ m/px}, \qquad v = \overline{\Delta v} \cdot S_y \cdot \text{FPS} \cdot 3.6 \quad [\text{km/h}].$$

The raw speed is clipped, then smoothed with a median filter and a Savitzky-Golay filter. The heading comes from the average angle of the two rails, not from the flow, so it still works on textureless track. Speed and heading are integrated into a trajectory by dead reckoning.

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

**Results**

We evaluate on the [Nordlandsbanen](https://nrkbeta.no/2013/01/15/nordlandsbanen-minute-by-minute-season-by-season/) recording, a 10-hour, 729 km train journey through Norway. The speed values in its metadata were quantized and wrongly scaled. So we recomputed the ground-truth speed from the raw GPS positions and checked it against landmark distances on satellite maps.

On a 750-second summer sequence of about 16 km:

| Metric | Value |
|---|---:|
| Speed MAE | 2.97 km/h |
| Speed correlation with GPS | 0.980 |
| Heading correlation with GPS | 0.987 |
| Distance traveled (ours / GPS) | 15,588 m / 15,878 m |
| Accumulated position drift | 898 m (5.66%) |

The total distance is close to GPS, but small speed errors add up in the position. On the first five minutes of the run, the mean absolute speed error is about 1.6 km/h, at an average speed of 64 km/h.

In tunnels and low light, the ballast texture disappears and the speed estimate becomes noisy, while the heading still follows the visible rail edges.
