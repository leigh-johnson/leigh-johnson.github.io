---
title: "Building an LED music visualizer on a Raspberry Pi - Assemble the Mats"
tags: ["raspberrypi", "neopixels", "python"]
description: "A multi-part series in which I attempt to build a rainbowlific music visualizer with an LED strip (WS2812) & Raspberry Pi. This post is a project introduction and materials/software list."
excerpt: "A multi-part series in which I attempt to build a rainbowlific music visualizer with an LED strip (WS2812) & Raspberry Pi. This post is a project introduction and materials/software list."
comments: true
hide_sidebar: false
---

# Design Goals

This project began with fanciful dreams of an RX controller+receiver set (see: [reactive programming](https://en.wikipedia.org/wiki/Reactive_programming)) that parses an audio stream for data, transforms the dataset, runs tests against the transformed data to determine callback parameters, and then emits a message to the WS281x API. 

This sort of RX design would allow humans (or machines) to drop in rules about musical data patterns, like using a pre-defined RGB palette in a certain key or modifying a hue transition scaler when the data steam is above a threshold in the time domain (e.g. BPM > 90). 

# v1 Spec

First, I'll need to build a working hardware environment and a controller+receiver pattern. 

### Base Case (high level summary)

* A strip of LEDs mapped to Raspberry Pi GPIO 
* A controller application that emits web socket messages
* A high level wrapper around the WS281x spec + Raspberry Pi PWM 
* A receiver application that subscribes to web socket messages, whose callbacks are using WS281x API

A very basic example might allow the client/controller to set RGB values via CLI, which will push an event to a WSGI wrapper around the ws281x API. 

# Hardware 

* WS2812 LED Strip, like [NeoPixel RGB White 30 via Adafruit](http://www.adafruit.com/products/1376). 
* 3V to 5V level shifter [74HCT125 via Adafruit](http://www.adafruit.com/products/1787).
* Female/Male jumper wires
* Male/Male jumper wires
* Breadboard, like [half board via Adafruit](http://www.adafruit.com/products/64).
* Power supply. I'm using [5V 4A (4000mA) via Adafruit](http://www.adafruit.com/products/1466).
* Power Jack [via Adafruit](http://www.adafruit.com/products/368).
* Raspberry Pi 2
* [Raspberry Leaf](https://www.raspberrypi.org/blog/raspberry-leaf/) reference sheet. This is going to save me so many silly mistakes over the course of this project!

# Libraries & APIs

* [Socket.io](http://socket.io/) will handle pub/sub patterns between the controller and receiver. 
* [rpi_ws281x](https://github.com/richardghirst/rpi_ws281x) - both a [SWIG-generated interface](https://github.com/richardghirst/rpi_ws281x/blob/master/python/examples/lowlevel.py) and [high level API](https://github.com/richardghirst/rpi_ws281x/blob/master/python/examples/strandtest.py)


# Research, inspiration, references
* NeoPixels + Raspberry Pi [via Adafruit](https://learn.adafruit.com/neopixels-on-raspberry-pi/software)
* Hardware build is sourced from [this excellent tutorial](http://popoklopsi.github.io/RaspberryPi-LedStrip/#/ws2812), which will satisfy the hardware component of our base case. 
* [Understanding the FFT algorithm (Python)](https://jakevdp.github.io/blog/2013/08/28/understanding-the-fft/)
* [Analyzing audio using FFT ](http://stackoverflow.com/questions/604453/analyze-audio-using-fast-fourier-transform/604756#604756)
* [RxPY](https://github.com/Reactive-Extensions/RxPy) - a RX extensions in Python