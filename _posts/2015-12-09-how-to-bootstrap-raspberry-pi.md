---
title: "How to: Bootstrap a Raspberry Pi"
tags: ["RaspberryPi", "linux", "IoT"]
description: "Get your Raspberry Pi running and connected to Wifi in less than 15 minutes, no extra monitor/keyboard/mouse required."
hide_sidebar: false
excerpt: "This guide will walk you through a headless (no monitor, keyboard, mouse) Raspberry Pi setup, in under 15 minutes."
comments: true
--- 

## Overview

<div class="col-md-6"><p>This guide will walk you through a headless (no monitor, keyboard, mouse) Raspberry Pi setup.</p><p> We'll cover materials, installation, bootstrap a WiFi connection, and optionally configure a hostname & static IP.</p> </div>
<img class="thumbnail col-md-5" src="/assets/headless-raspberry-pi/scale.jpg" />

## Table of Contents
1. [Overview](#overview)
2. [Table of Contents](#table-of-contents)
3. [Gather the Materials](#gather-the-mats)
      1. [Hardware](#hardware)
      2. [Software](#software)
4. [Write Raspbian Image to Mico SD Card](#write-raspbian-image)
5. [Bootstrap Raspbian Settings](#bootstrap-raspbian)
    1. [Configure a WiFi connection](#configure-wifi-connection)
    2. [Automatically connect WiFi interface](#connect-to-wifi-automatically)
    3. [Change Pi's hostname](#change-pis-hostname-optional)
    3. [Assign a static IP](#assign-static-ip-optional)

## Gather the Mats

### Hardware
* A Raspberry Pi. 
  <small> [model Zero via Adafruit](https://www.adafruit.com/pizero)
* Micro SD Card 
* Micro USB cable
* USB Micro SD card reader/writer. 
    <small>Mine [via Adafruit](https://www.adafruit.com/product/939).</small>
* Micro USB Male to USB A Female adaptor. 
  <small>Mine [via Amazon](http://www.amazon.com/Micro-USB-Male-Female-Adapter/dp/B0027YYMU6)</small>
* USB Wifi dongle
    <small>Mine [via Adafruit](https://www.adafruit.com/products/814). </small>

### Software
* [Latest Raspbian release](https://www.raspberrypi.org/downloads/raspbian/)
    <br><small>I'm using Raspbian Jessie Lite, which is a headless distro. This Raspbian image is small because GUI libraries/programs (like X) aren't included by default. Jessie Lite will fit on a <strong>2GB SD card</strong>, but the desktop image will require at <strong>least 4GB of space**.</strong> </small>

## Write Raspbian Image

Raspberry Pi provides official guides for each operating system:

  * [Linux](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
  * [OS X](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)
  * [Windows](https://www.raspberrypi.org/documentation/installation/installing-images/windows.md)

## Bootstrap Raspbian

How you mount the Raspbian filesystem and edit files also depends on your operating system.

### Windows & OS X Instructions - @todo
### Linux Instructions

#### Configure WiFi connection
* Run command `df -h` to list filesystem info. 
  {% highlight bash %}
    /dev/sdb2       7.2G  831M  6.1G  12% /media/userName/c7f58a52-6b71
/dev/sdb1        60M   20M   41M  34% /media/userName/boot
  {% endhighlight %}
* `cd` into the root filesystem, which is `/media/userName/c7f58a52-6b71` in the example above.
* `nano etc/wpa_supplicant/wpa_supplicant.conf` to edit the WPA supplicant config.
* Add the following config:
  {% highlight bash %}
    network={
        ssid="Network_SSID"
        psk="yourPassword"
    }
  {% endhighlight %}
* Ctrl+X and press Y to save.

#### Connect to Wifi automatically 
* `nano etc/network/interfaces`
* Add `auto wlan0` to the first line of this file.
* If you want to use DHCP, append the following to the bottom of this file. Or, [assign a static IP](#assign-static-ip-optional) instead.
  {% highlight bash %}
  allow-hotplug wlan0
iface wlan0 inet dhcp
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
iface default inet dhcp
  {% endhighlight %}
* Ctrl+X and press Y to save.

#### Change Pi's hostname (optional)

* `nano etc/hosts`
  {% highlight bash %}
  127.0.0.1       localhost
#The following config should be used for IPv6
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
#Raspberry Pi's new host name
127.0.1.1       newhostname
  {% endhighlight %}
* Ctrl+X and press Y to save.
* `nano etc/hostname`
  {% highlight bash %}
   newhostname
  {% endhighlight %}
* Ctrl+X and press Y to save.

#### Assign Static IP
* `ifconfig -a` from a machine connected to the same Wifi network, or from a Pi currently using DHCP.
* Take note of **inet addr**, **Bcast**, and **Mask**
* `route -n`
* Take note of the **Gateway Address** and **Destination Address**. 
* `nano etc/network/interfaces` and add the following:
  {% highlight bash %}
allow-hotplug wlan0
iface wlan0 inet static
    address <desired IP address>
    netmask <Mask>
    broadcast <Bcast>
    network <destination address>
    gateway <gateway address>
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
  {% endhighlight %}


## Unmout the Micro SD card and boot up the Raspberry Pi! 
  
  The default password is <i>raspberry</i>.
  
  {% highlight bash %}
  $ ssh pi@raspberrypi
  {% endhighlight %}
  {% highlight bash %}
  # If you don't have a nameserver, use the Pi's IP.
# You can find the Pi's IP in your router's DHCP lease list
# Or setup a static IP
$ ssh pi@10.11.12.13
  {% endhighlight %}

And you're ready to go! I recommend running `sudo apt-get update` & `sudo apt-get upgrade`, then setup key-based authentication and user accounts.


