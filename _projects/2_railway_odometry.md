---
layout: page
title: Railway visual odometry
description: Metric localization of a train from a single camera, using the geometry of the track.
img: assets/img/projects/thumbs/railway.jpg
importance: 3
category: coursework
---

Joint work with Etienne Maugars for the Computer Vision course at CentraleSupélec (2026).

Trains need to know their speed and position, but GPS drops out in tunnels and mountains. We estimate both from a single front-facing RGB camera. Classical visual odometry has no metric scale with one camera. The railway provides it: the track is a flat, known structure, and the gap between the rails is always 1.435 m.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include video.liquid path="assets/video/railway-odometry.mp4" class="img-fluid rounded z-depth-1" autoplay=true loop=true muted=true controls=true %}
    </div>
</div>
<div class="caption">
    Our pipeline on 25 seconds of the Nordlandsbanen recording: detected rails, bird's-eye view (top right), estimated speed against GPS, and heading. Footage: NRK.
</div>

**Problem**

From the frames $I_{0:t}$ we want the state $$S_t = \lbrace x_t, y_t, \theta_t, v_t \rbrace$$: 2D position in meters, heading and forward speed. With one camera, a pixel $u$ only gives a ray. The 3D point is

$$X = \lambda \, K^{-1} u,$$

where $K$ holds the camera intrinsics and the scale $\lambda$ is unknown. A train is a good case for fixing $\lambda$. It always stays on the rails, and the camera height and angle barely change, so the system can be calibrated once.

**Pipeline**

1. **Region of interest.** We crop a fixed trapezoid in normalized coordinates (bottom at $y = 1.0$, $x \in [0.35, 0.75]$, top at $y = 0.65$, $x \in [0.44, 0.57]$). It covers the near track, where the rails look straight. The crop is converted to grayscale and enhanced with CLAHE.
2. **Rail detection.** Canny edges (thresholds 50 and 150), then a probabilistic Hough transform ($\rho = 1$ px, $\theta = 1°$). We keep lines with slope $m \in [-0.7, 0.7]$, which drops sleepers and poles. The right rail must lie 100 to 500 px to the right of the left one. Endpoints are smoothed over time with $L_t = (1-\alpha) L_{t-1} + \alpha L_{\text{meas}}$ and $\alpha = 0.10$.
3. **Inverse perspective mapping.** For each frame, a homography $H$ maps the four rail endpoints to the corners of a $400 \times 400$ image: $$\tilde{p}^{\prime} \sim H \tilde{p}$$ in homogeneous coordinates. Recomputing $H$ every frame cancels the roll and pitch of the cab, so the rails stay vertical in the bird's-eye view.
4. **Speed.** Shi-Tomasi corners are tracked on the ballast and sleepers with Lucas-Kanade optical flow. The rails themselves are masked out, since motion along a line is ambiguous. Lateral and backward vectors are rejected.
5. **Heading.** It comes from the rail slopes, not from the flow, so it keeps working on textureless track.
6. **Dead reckoning.** Speed and heading are integrated into a trajectory.

**Scale and formulas**

The warp stretches the trapezoid into a square, so the gauge only fixes the lateral scale. For forward motion we measured that the region covers $L = 14.5$ m of track. This gives a fixed vertical scale in the bird's-eye view:

$$S_y = \frac{14.5 \text{ m}}{400 \text{ px}} \approx 0.036 \text{ m/px}.$$

The speed then follows from the median vertical flow $\overline{\Delta v}$ of the valid features:

$$v = \overline{\Delta v} \cdot S_y \cdot \text{FPS} \cdot 3.6 \quad [\text{km/h}].$$

It is clipped to $[1.8, 180]$ km/h with bounded acceleration, then passed through a 25-frame median filter and a Savitzky-Golay filter. The heading averages the angles of both rails:

$$\theta_t = \frac{\arctan(m_L) + \arctan(m_R)}{2} + \theta_{\text{offset}},$$

followed by a 15-frame median filter, a rate limit of $\pm 3°$/s and a Savitzky-Golay filter (window 51). Position is updated with

$$x_{t+1} = x_t + v_t \Delta t \cos(\beta \theta_t), \qquad y_{t+1} = y_t + v_t \Delta t \sin(\beta \theta_t),$$

where $\beta$ is a calibration gain from image angle to physical heading.

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

**Ground truth**

We evaluate on the [Nordlandsbanen](https://nrkbeta.no/2013/01/15/nordlandsbanen-minute-by-minute-season-by-season/) recording: a 10-hour, 729 km train journey through Norway, filmed at 1080p and 25 fps. The speed values in its metadata were quantized and wrongly scaled. So we recomputed speed from the raw GPS positions, with the geodesic distance $d_i$ between consecutive fixes on the WGS84 ellipsoid and $v_i = d_i / \Delta t$. A Savitzky-Golay filter (51 frames, order 3) removes the jitter. We checked this ground truth against distances between landmarks measured on satellite maps. Detection parameters were tuned on a separate segment.

**Results**

On a 750-second summer sequence of about 16 km:

| Metric | Value |
|---|---:|
| Speed RMSE | 5.03 km/h |
| Speed MAE | 2.97 km/h |
| Speed bias | −1.42 km/h |
| Speed correlation with GPS | 0.980 |
| Heading RMSE | 10.1° |
| Heading correlation with GPS | 0.987 |
| Distance traveled (ours / GPS) | 15,588 m / 15,878 m |
| Accumulated position drift | 898 m (5.66%) |

On the first five minutes of the run (t = 10 to 300 s), the mean absolute speed error is about 1.6 km/h, at an average speed of 64 km/h.

**Limits**

The method depends on image quality. In tunnels and low light, the ballast texture disappears in the bird's-eye view. Optical flow then fails, and the speed estimate becomes noisy or freezes. The heading still holds (correlation 0.97 on such a section), because the rail edges stay visible. But speed gaps add up in dead reckoning: on one difficult 7 km section the drift reached 648 m (9.33%). An IMU would be the natural fix to bridge these gaps.
