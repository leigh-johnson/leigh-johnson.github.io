---
title: "PyCon 2016: There and Back Again"
tags: ["pycon2016", "python"]
excerpt: "My first PyCon: a serendipitious story. Travel log, reactions to talks, and long-form hallway discussions."
comments: true
hide_sidebar: true
---

<div class="col-sm-4 pull-right">
<img class="img-responsive" src="/assets/pycon2016/worlds-largest-foucaults-pendulum.jpg" />
<footer><small>I didn't know it at the time, but Portland's Convention Center houses the world's largest Foucault's Pendulum. Every day, we stared upwards and puzzled over the mechanism powering this fixture. Suggestions ranged from: magic, motors, magnets. Turns out it's the Earth's rotation! The angular velocity of the pendulum's precession on its plane is a projection of the Earth's own angular velocity. </small></footer>
</div>

## A path paved by serendipity

The kindness of another Ansible engineer made it possible for me to attend PyCon2016. He couldn't make it, and graciously he offered me his ticket. I wasn't sure if I'd be allowed to go until mere days before the conference began. I received clearance, booked my flight, and packed a bag in a span so short that I thought it must be a dream sequence. The randomness of life usually doesn't muster so neatly, right?

First, I need to say that PyCon2016 is the best conference I've ever attended.

PyCon was unlike any conference I worked while in the video games industry (PAX, ECGC, GDC). In the past, I've been one small person in a throng of 70,000+. At ~3,200 attendees, PyCon felt warm and familial. I asked everyone I met "how do you know each other?" and received responses that mapped across many years and shared projects.

At booths in the games industry, I **hustled**: try the demo, register for an account, tell a friend! At Ansible's PyCon booth, I **listened**. In three days, users described to me elaborate menageries of systems managed by Ansible automation. I was floored by the enthusiasm of most engineers I talked to. The fresh adopters were most ecstatic: so many were pleasantly surprised that their problem took hours, not days, to solve to their satisfaction.

## Talks

I attended about half a dozen talks in three days, and queued up more for the plane ride home. I spent a lot of time furiously Googling. Stream of consciousness reactions and tangential research below.

## Machete-mode debugging - Ned Batchelder

[video, transcription, slides](http://nedbatchelder.com/text/machete.html)

* Embrace ephemeral code. Don't be afraid to write jank to isolate a problem and extract information about it.
* You probably don't need to append to sys.path.
* importing a Python module will also execute it
* [inspect](https://docs.python.org/2/library/inspect.html])

    `inspect` is a nifty module in the Python standard lib that I hadn't used before. The talk cited an example where `inspect.stack` was used to a inspect a call stack find the source of a double-imported module. `inspect.stack` wraps `inspect.getouterframes(sys._getframe(depth))` where `depth` is the contextual level passed to `inspect.stack`.

* Monkey patch via `site-packages/*.pth` to ensure patch is applied before the function is called
* `pdb.set_trace()` can be used inside of a trace function. Ned's example and one of my experiments below:

{% highlight python %}
def trace(frame, event, arg):
    # break if the 0th element of sys.path endswith '/lib'
    if sys.path[0].endswith("/lib"):
        pdb.set_trace()
    # return a reference to iself in scope, or another function to further trace this scope
    return trace

sys.settrace(trace)
{% endhighlight %}
{% highlight python %}
# That's neat, but what can we do with the frame and event arguments?
# This inspects the name of the code object executed in each frame
def traceMyFuncNames(frame, event, arg):
    if event == "call":
        print "calling function: {0}".format(frame.f_code.co_name)
    elif event == "return":
        print "returning function: {0}".format(frame.f_code.co_name)
    return traceMyFuncNames
sys.settrace(traceMyFuncNames)
{% endhighlight %}
* Followup talk: [How C trace functions really work](http://nedbatchelder.com/text/trace-function.html)

## Networking without an OS - Josh Triplett

[video](https://www.youtube.com/watch?v=AlkKvetGFSk)
[slides](https://speakerdeck.com/pycon2016/josh-triplett-networking-without-an-os)
[BIOS Implementation Test Suite (BITS)](https://biosbits.org/)

I attended this one because I have a pet interest in projects that run Python on bare metal. I started building small programs to run on a [WiPy](https://www.indiegogo.com/projects/the-wipy-the-internet-of-things-of-the-future#/), which is a microcontroller running a port of [MicroPython](http://docs.micropython.org/en/latest/wipy/index.html). Although I can write code and execute it on a WiPy, I don't have a strong fundamental understanding of how MicroPython works, especially because each port seems specific to the given board's architecture.

About 95% of this talk went way over my head. But here are my entry-level info bullets:

* BITS runs on 32-bit BIOS or 64-bit EFI
* Underpinning tech: possible to run Python 2.7 in GRUB 2 by adding Python's source files into GRUB's build system.
* Custom `pyconfig.h` to declare which features are available (exclude all requiring an OS)
* Parsing overhead reduced by using Python bytecode
* Interface to EFI provided via [libffi](https://sourceware.org/libffi/). The "extensible" in "EFI" means you can create protocols using native C. `libffi` is packaged with `ctypes`

## Small Batch Artisanal Bots: Let's Make Friends - Elizabeth Uselton

[partial video only :(](https://www.youtube.com/watch?v=HH6bD29gZFg)

Using microprojects to stitch together fundamental concepts, with a quick/fun outcome. These Twitter bots are freakin' adorable.

* [@stealthmountain](https://twitter.com/stealthmountain) - alerts tweeters when they've typed "sneak peak" instead of "sneak peek"
* [@viralhulk](https://twitter.com/viralhulk) - retweets BuzzFeed articles in HULK SMASH speak
* [@FBIbot](https://twitter.com/FBIbot) - tweets random pages from Freedom of Information Act releases

## A Beginner's Guide to Deep Learning - Irene Chen

[video](https://www.youtube.com/watch?v=d5tFV3lmUXE)
[slides](https://speakerdeck.com/pycon2016/irene-chen-a-beginners-guide-to-deep-learning)

<div class="col-sm-4 pull-right">
<img class="img-responsive" src="/assets/pycon2016/more-math-pls.png" />
<footer><small>I wish there'd been a LOT more coverage on the math used to calculate weights/bias in a hidden layer.</small></footer>
</div>

I've been working through the problem sets in [Machine Learning in Action](https://www.manning.com/books/machine-learning-in-action) for about six weeks, but that's the extent of my exposure to machine learning (let alone deep learning networks).

This was the most accessible talk on deep learning that I've ever heard. Irene started very high-level (on the subject of avocados), and within five minutes transitioned her audience into examples of forward and backward propagation.

New libraries and toolkits to check out:

* [Scikit-learn](http://scikit-learn.org/stable/)
* [Caffe](https://github.com/BVLC/caffe)
* [Theano](http://deeplearning.net/software/theano/)

## Move Things From One Computer to Another, Safely - Brian Warner

[slides](http://www.lothar.com/~warner/MagicWormhole-PyCon2016.pdf)
[video](https://www.youtube.com/watch?v=dgnikoiau68)

My favorite talk! I wrote a long-form response to this one on the plane home, where I write about using Magic Wormhole to fasicilate multisignature Bitcoin trasactions. Read more: [PyCon2016 - Down the Magic Wormhole](/pycon2016-down-the-magic-wormhole/)

## Revitalizing Python Game Development: Packaging, Performance, and Platforms - Jacob Kovac

[video](https://www.youtube.com/watch?v=z09_Z2VG2_8)

[Kivy](https://kivy.org/#home) is a library close to my heart.

I don't have any formal education or background in computer science. While slinging lattes, I finished the first pilot of edx.org's [MITx 6.00 series](https://www.edx.org/course/introduction-computer-science-mitx-6-00-1x-7). While perspiring through that MOOC, I gravitated towards was Kivy when I realized I had the knowledge and tools to begin building my own games. In a month, I coded [a helper app](https://github.com/leigh-johnson/MAFIA) for my favorite party game, Mafia.

Kivy provides cross-platform interfaces to common mobile features, like multi-touch, gestures, cameras, accelerometers. When I was a new programmer, Kivy obscured just enough complexity to allow me to cobble together high-level logic to drive a Mafia game.

I squee'd aloud when I heard Kivy now supports Python 3 (if you don't package for iOS). Expect my next blog post to be a writeup describing a 2D game engine, like a [Die2Nite](http://www.die2nite.com/) clone or clone of a card-based game like [Arboretum](https://boardgamegeek.com/boardgame/140934/arboretum) or [Mottainai](https://boardgamegeek.com/boardgame/175199/mottainai).

I strongly believe that game development space in Python is perfect for engaging with new programmers. Kivy's toolchain and API are a triumph in simple usage, which is an area larger engines like Unity/Unreal/Crytek/Gamemaker etc struggle with. Having spent time in the games industry, I know that onboarding a gameplay designer to one of these engines takes months and months. I transitioned to brewing double espressos to brewing my own game in under thirty days, which is remarkable, and made entirely possible by Kivy.

So, I closed my PyCon experience with a nod back to the library that originally inspired me to create cool things and pursue work as engineer. The feedback loop goes ever on and on~
