### Why I volunteered to re-architect Internet email

_by Liam Breck, Menlo Park, California_ &ndash; January 2021

The short answer to "Why?" is startling.
Email must be replaced. SMTP should be blocked on public networks.

At first, these sound like crazy assertions.
But consider that at least 9% of one billion knowledge workers have largely abandoned email 
for Slack, MS Teams, and other SaaS & intranet messaging applications.

Email is going extinct, because phishing has made it a trivial cybercrime portal.
Consumers, organizations, governments, and specific individuals have been relentlessly targeted
for the purpose of stealing money and confidential data, or planting malware.
Email technology offers no effective means to stop phishing,
so it's been a runaway success for the attackers, and a disaster for millions.

But _email the concept_ is too important to let corporate agendas define its future.
Email is a foundational Internet application.
Therefore the open source community must act to replace it, and ___act now___.

So I've drafted a protocol, called TMTP, 
and published implementations of both client and server as open source.
TMTP is simple, and preserves the soul of email, while dramatically reducing its vulnerabilities.
So how did I get here?

In 2002, after I left the Internet startup I founded in Silicon Valley (Synchron Networks), 
I began thinking and writing about how one would design, from scratch, an offline personal computing environment 
based on the Web user experience&mdash;hyperlinked, multi-format documents.
Its apps and data would be local to your device, but sharable with others by replication.
I sourced one of the design elements from software version control, 
that each set of related edits to a collection of local-web documents is packaged as a revision.
When saved, a revision is distributed via a store-and-forward Internet service to all others sharing the collection.
(I had other insights, about both hardware and software, which I'll happily share if we meet for drinks.)

In 2010-12, I prototyped this, in Node.js, as project Elembe.
It worked well enough, but it was a platform, not an application, 
and I couldn't see the killer app which would make it fly.
So I set it aside, and pursued the hardware concept I alluded to.
(That was an eventful misadventure, which I'll also happily share over drinks.)

In the Spring of 2017, I had a revelation&mdash;I don't recall what triggered it.
_Oh my god, the killer app... It's email!_
I'd unconciously realized that email would not survive the cybercrime crisis;
a new protocol would be required, and I'd already prototyped it.
I also recognized that a for-profit startup probably couldn't convince the world to adopt a new protocol.
The evident central concern of a for-profit venture is to enrich its owners.
The goal of my project would have to be making the Internet safer, while keeping it open.

Three months later, I had a working server in Go, a protocol draft, and a short essay titled "Why TMTP?"
I considered announcing the project then, 
but decided that it would be more credible given a client application with features missing in today's email.


Many warned the IETF that spam was a serious problem, and should be addressed at the protocol level,
even at significant cost.
Sadly, members of the IETF derided such critics as "anti-spam kooks", 
and their suggestions as "FUSSPs" (final, ultimate solutions to the spam problem).

