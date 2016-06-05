---
title: "PyCon 2016: Down the Magic Wormhole"
tags: ["pycon2016", "python", "encryption"]
excerpt: "Brian Warner created a PAKE-based exchange to unite two inbound TCP connections, and initiate an adhoc data transfer between them."
comments: true
hide_sidebar: true
---

<script src='https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>

<div class="col-sm-4 pull-right">
<img class="img-responsive" src="/assets/magic-wormhole/easy-vs-safe.png" alt="source: Move Things From One Computer to Another, Safely by Brian Warner"/>
<footer><small>source: <a href="http://www.lothar.com/~warner/MagicWormhole-PyCon2016.pdf">Move Things From One Computer to Another, Safely by Brian Warner</a></small></footer>
</div>

## Why Magic Wormhole?
[Magic Wormhole](https://github.com/warner/magic-wormhole/) is the first library I've encounted that fasciliates p2p file transfer using a human-utterable keying phrase. Other common patterns depend on committing 60+ bytes to human memory (or use a third-party shortening service for brevity). Brian Warner describes his library as the intersection between "easy" and "safe."


## Example useage: two-factor bitcoin wallet
I maintain one bitcoin address on my laptop, and another on a Raspberry Pi Zero. I keep my funds in a multi-signature wallet signed by both, which means both devices must issue a signature to finalize a transaction.

First, I initiate and sign the bitcoin transaction from my laptop. Then, I use Magic Wormhole to easily forward the transaction identity over to my Pi. Receiving the 34+ byte string is as easy as uttering <i>"Nine. Bison. Jawbone."</i> After I receive the hex string on my Pi, I can sign finalize the transaction.

{% highlight bash %}
laptop$ bitcoin-cli signrawtransaction  some_hexstring <params>
laptop$ wormhole send --text some_hexstring
Sending text message (34 bytes)
On the other computer, please run: wormhole receive
Wormhole code is 9-bison-jawbone
{% endhighlight %}{: .width-65}
{% highlight bash %}
pi$ wormhole receive
Enter receive wormhole code: 9-bison-jawbone
some_hexstring
pi$ bitcoin-cli signrawtransaction some_hextstring <params>
{% endhighlight %}{: .width-65}


## Example useage: three-way bitcoin escrow

Bob commissions Alice to provision a private Hello Kitty Island Adventure game server. They both agree to use a mutual acquitance, Carol, as an escrow arbiter for this transaction.

Bob and Alice provide their public bitcoin addresses to Carol. Carol generates a 2-of-3 multisignature address using the signatures received from Bob and Alice, plus her own. Carol broadcasts the 2-of-3 address to Alice and Bob.

All three parties are now cognizant of the escrow address. When the transaction is signed by any 2 parties, it will be broadcasted to the blockchain.

Magic Wormhole supports out-of-band keying. Bob, Alice, and Carol can select an unused channel ID and use it to broadcast/receive with the `--code` argument.

#### Alice and Bob broadcasting their wallet addresses to Carol
{% highlight bash %}
bob$ wormhole send --text bob_hexstring --code 1-tonic-willow
Sending text message (34 bytes)
{% endhighlight %}{: .width-65}
{% highlight bash %}
alice$ wormhole send --text alice_hexstring --code 2-cublic-filament
Sending text message (34 bytes)
{% endhighlight %}{: .width-65}
{% highlight bash %}
carol$ wormhole receive
Enter receive wormhole code: 1-tonic-willow
<bob_hexstring>
carol$ wormhole receive
Enter receive wormhole code: 2-cubic-filament
<alice_hexstring>
{% endhighlight %}{: .width-65}

#### Carol broadcasting the 2-of-3 address to Alice and Bob
{% highlight bash %}
carol$ wormhole send --text 2_of_3_hexstring --code 1-willow-tonic
Sending text message (34 bytes)
carol$ wormhole send --text 2_of_3_hexstring --code 2-filament-cubic
Sending text message (34 bytes)
{% endhighlight %}{: .width-65}
{% highlight bash %}
alice$ wormhole receive
Enter receive wormhole code: 2-willow-tonic
<2_of_3_hexstring>
{% endhighlight %}{: .width-65}
{% highlight bash %}
bob$ wormhole receive
Enter receive wormhole code: 2-filament-cubic
<2_of_3_hexstring>
{% endhighlight %}{: .width-65}


## Neat. How does it work?

PAKE & SPAKE2 use a weak shared password to derive a much stronger shared secret key. If both sides input the same password, both sides can anticipate receiving the same key. If either side inputs a password failing the challenge, the received keys will be random.

Brian Warner mentioned SPAKE2 strongly resembles a basic DH exchange, which gave me a stronger grasp of what's happening going on stage right. Here's my crack at solving drastically over-simplified version of this problem (expect at least 3 things to be utterly wrong):

<div class="col-sm-5 pull-right">
<img class="img-responsive" src="/assets/magic-wormhole/spake2.png" alt="source: Move Things From One Computer to Another, Safely by Brian Warner"/>
<footer><small>Probably Magic. <br>Source: <a href="http://www.lothar.com/~warner/MagicWormhole-PyCon2016.pdf">Move Things From One Computer to Another, Safely by Brian Warner</a></small></footer>
</div>
{% highlight python %}
# pseudocode: easier than latex
# pw - password phrase in bytecode
# p is a pre-agreed prime
# g is a generator of some kind
# H() - a hash function
# X1, Y1 - scaler multiplication of the random entropy onto the generator
# X2, Y2 - result of X/Y1 added to the scaler multiplication of the password bytecode onto some arbitrary points
# M, N - some arbitrary points
# P, Q - the propositions

def scalarMult(A,n):
    result = [[n*i for i in row] for row in A]
    return result

def H(n):
    return someImportedHash(n)

x = os.urandom(p)
y = os.urandom(p)
X1 = scalerMult(g, x)
Y1 = scalerMult(g, y)
X2 = X1 + scalerMult(M, pw)
Y2 = Y1 + scalerMult(N, pw)
# this is probably not the right way to negate a constant, send help!
P = scalerMult(X2 + scalerMult(M, -(pw)), x)
Q = scalerMult(Y2 + scalerMult(N, -(pw)), y)
assert H(pw + X2 + Y2 + P) == H(pw + X2 + Y2 + Q), "One of these things is not like the other"
key_1 = H(pw + X* + Y* + P)
key_2 = H(pw + X* + Y* + Q)
{% endhighlight %}

## What does a selfsame session key do?

All subsequent communications between the two clients are encrypted using this key. After the keying step, the clients attempt to forge a connection.

Each client will listen to a set of TCP ports and also broadcast on a range of ports. The first successful response to a client's key challenge will initiate the next connection step.

## But what if either client is behind a NAT?

Magic Wormhole direct connections through a TURN server, which allows a client behind a NAT to request that the server act as relay.  The server relays packets on the behalf of the client to and from peers.

TURN is the most expensive relay protocol, becauase it behaves as a data stream between peers. Brian Warner has generously baked his own TURN into the source code of Magic Wormhole.

## Where to from here?

I setup a fragile TURN (tcp:wormhole.leighjohnson.com:4001) and websocket rendevous (ws://wormhole.leighjohnson.me:4000) without much effort. I haven't been able to use either by passing options through the CLI, but they're working fine when I replace the hard-coded values in [magic-wormhole/src/wormhole/cli/public_relay.py](https://github.com/warner/magic-wormhole/blob/master/src/wormhole/cli/public_relay.py).

The takeaway: PAKE crypto is a nifty way to ramp humans/devices into a more complex exchange. Some more use cases I think are worth exploring:

1. Aggressively re-key communications between IoT devices
2. Hand out digital swag at events, lottery style. A balanced PAKE challenge provides feedback for humans that is very similar to a scratch-card or door reveal.
3. Verbal payment systems, where payment is issued and a new password is generated after a key agreement is satisfied.

## References

1. [Move Things From One Computer to Another, Safely by Brian Warner](http://www.lothar.com/~warner/MagicWormhole-PyCon2016.pdf)
2. [Magic Wormhole: Simple Secure File Transfer - PyCon 2016](https://www.youtube.com/watch?v=dgnikoiau68)
3. [PAKE use cases @ Curves list](https://moderncrypto.org/mail-archive/curves/2015/000408.html)

