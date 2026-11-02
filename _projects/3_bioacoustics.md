---
layout: page
title: Waraki
description: Live bird species detection from a Taranaki forest, for an art installation at the Len Lye Centre.
img: assets/img/projects/thumbs/waraki.jpg
importance: 1
category: research
github: https://github.com/comoxx/buggd_waraki
---

Research internship at the [WickerLab](https://wickerlab.org/) (machine learning for the environment), University of Auckland, March to June 2025. Supervised by Joerg Wicker, in collaboration with the art and science collective Terrestrial Assemblages and the artist Simon Ingram.

**The goal.** Bring the soundscape of a forest in Taranaki live into a museum. A microphone in the forest streams audio over 4G. A server receives it, a model identifies the birds that sing, and the museum turns it into sound and images. Everything has to run without anyone on site.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/waraki-system.png" title="System overview" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    System overview: microphone in the forest, live 4G streaming, server, species classification, visualization and sound in the museum.
</div>

The work fed into Simon Ingram's piece *Vibrating World: Rotokare Forest, 39.45254° S, 174.41727° E*, shown in the exhibition [*Direct Bodily Empathy – Sound, Signal, Feedback*](https://govettbrewster.com/exhibitions/2026/direct-bodily-empathy-sound-signal-feedback) at the Govett-Brewster Art Gallery & Len Lye Centre, New Plymouth (April to October 2026).

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/waraki-platform.jpg" title="Waraki web platform" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm-4 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/waraki-deployment.jpg" title="Bugg recorder in the field" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: the Waraki web platform. Right: a Bugg recorder deployed in Simon Ingram's garden.
</div>

### Acquisition: the Bugg recorder

The field device is a Bugg: a Raspberry Pi 3 with a microphone, a SIM card and an SD card. Out of the box it records long segments and uploads them in batches to Google Cloud. That is slow, costly, and not live.

I rewrote its software in Python with two multi-threaded modes. In **streaming** mode the microphone never stops. Audio goes into a circular buffer in RAM, and a second thread compresses it and sends it over a WebSocket. In **saving** mode the device records fixed-length clips, then compresses them, writes them to the SD card and uploads them to an API endpoint. [Code on GitHub](https://github.com/comoxx/buggd_waraki).

### Platform

A web platform for the researchers, built with React and Django. You can upload, store, share and download recordings, listen to the live stream, and look at each recording as a spectrogram.

### Model: fine-tuning BirdNET for New Zealand

New Zealand has more than 300 bird species, many found nowhere else. The researchers' validated recordings covered about 150 species with 500 clips, which is too few to train on. I added open data from the Department of Conservation and Xeno-canto, for a final dataset of about 2,000 clips with at least 15 per species. Labels from each source used different names, so I mapped them all to one English and Māori naming standard.

The recordings were long and labeled as a whole, so many segments held only silence or noise. I filtered them in two ways: a signal-to-noise check, then BirdNET as a teacher, keeping only segments where it detected a bird above a threshold.

I compared Google's Perch and Cornell's BirdNET, then used transfer learning on BirdNET. I kept its preprocessing and ResNet backbone frozen and trained a new classification head for the local species plus a negative class. The output uses a sigmoid per class, so the model can detect several birds singing at once.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/waraki-spectrogram.png" title="Bird calls" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Waveform and spectrogram of bird calls. The model works on mel-spectrograms like this one.
</div>

### Results in the field

On common species (tūī, bellbird, silvereye) the fine-tuned model matches BirdNET's F1-score. Rare species stay hard because there is so little data. On real Bugg recordings the difference is clearer. Stock BirdNET often "hears" species that do not live in New Zealand. The fine-tuned model stays geographically consistent.

The outcome is a full IoT and AI pipeline that handles real-world signal with all its imperfections, from the microphone in the forest to the gallery.
