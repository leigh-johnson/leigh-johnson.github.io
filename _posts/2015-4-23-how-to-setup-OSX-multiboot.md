---
title: "How to setup & configure a multiboot environment on OS X"
tags: ["#osx", "#sysadmin", "#environments"]
description: "Multiboot is a handy way to house multiple test environments & configurations on one machine. Multiboot is very easy to setup on OS X"
excerpt: "Multiboot is a handy way to house multiple test environments & configurations on one machine. Multiboot is very easy to configure in OS X."
comments: true
hide_sidebar: true
---

## Why should I multiboot?

Machines are expensive! If you need to test a product against multiple versions of OS X, it's VERY costly to purchase an Apple computer per unique configuration. 

Multiboot is a powerful tool for both developers & quality assurance testers, and it's very easy to setup. 

## How do I get started?

First, you should figure out which versions of OS X you're going to support. 

This tutorial assumes you already have an Apple computer and a valid install of OS X. These instructions were written using 10.10.3 for reference.

### Download all OS X installer packages

1. Open the **App Store** & browse to the **Purchases** tab. 
2. Download the versions of OS X you'll need. If you see an error that prompts *Would you like to continue?*, press continue.
3. If your current version of OS X is ahead of the one you just downloaded, you'll see can error: *This copy of "Install OS X" application is too old to be opened on this version of OS X*. Dismiss this error by pressing the quit button. 


### Partition the HDD (Part 1)

While the installer packages are downloading, partition your HDD. 

1. Open the ``Disk Utility`` tool.
2. In the left-hand column, you'll see a list of hard drives & partitions. Select the ```APPLE HDD``` or the top-most mount point in the tree. **DO NOT** select ```Macintosh HD```.
3. Browse to the ```Partition``` tab. You should see a partition layout. From this list of partitions, select ```Macintosh HD```  and then use the <i class="fa fa-plus"></i> to add a partition.
4. Under ```Partition Information```, choose a name for your new partition. I recommend naming each partition after the OS version it'll house, e.g. "10.8 Mountain Lion"
5. Press ```Apply```
6. Repeat steps 4-5 until you have one partition for each OS you need to install, **plus one more partition**. So if you need to install 2 additional OS versions, create 3 partitions. 
7. Name the final partition ```InstallVolume```

### Mount the Installers (Part 2)

Wait for the OS X installers to finish downloading before proceeding.

1. Open the **Applications** folder & find "Install OS X {Version}.app"
2. Right-click the .app and select **Show Package Contents"
3. Browse to ```Contents/SharedSupport``` and double-click ```InstallESD.dmg```
4. Open the ```Terminal``` and enter the following commands:
5. ```defaults write com.apple.finder AppleShowAllFiles YES```
6. ```killall Finder```
7. When ```InstallESD.dmg``` is done mounting, you should see an entry under the ```Devices``` menu called ```OS X Install ESD```. Open it.
8. You should see a greyed-out file called ```BaseSystem.dmg```. Right-click it & **Open With** ```DiskImageMounter.app```

### Write the Installers to InstallVolume (Part 3)

Is your HDD done partitioning yet? Wait for it to finish before proceeding. 

1. In the ```Disk Utility``` tool, select ```InstallVolume``` from the left-hand list. 
2. Browse to the ```Restore``` tab.
3. Ensure the **Source** is already ```InstallVolume```! 
4. You should see ```BaseSystem.dmg``` in the list of images on the left. Drag ```BaseSystem.dmg`` (**DO NOT** drag ```OS X Base System```) into the ```Destination``` field on the right.
5. Press restore.
6. When the write is done, the ```InstallVolume```'s name' will change to ```OS X Base System```

### Install the OS X Version (Part 4)

1. Reboot your Apple computer.
2. On the grey bootloader screen, press ```Option```. You should see a list of available startup disks.
3. Select ```OS X Base System``` as the startup disk. 
4. Complete the OS X setup instructions. If you've gotten this far, you don't need me to walk you through OS setup. <i class="fa fa-heart"></i>

### Repeat Parts 2-4 for each version of OS X you need in your multiboot environment. Continue re-using the "OS X Base System" partition for your install files.
 
### You can set the default startup disk via ```system preferences```