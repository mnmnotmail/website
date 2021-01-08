<a href="/"><img height="36" align="left" src="logo-48-bleed-bright.png"></a>
<a href="https://dev.to/mnmnotmail"      ><img height="36" align="right" src="icon-dev-gray.svg"></a>
<a href="https://facebook.com/mnmnotmail"><img height="36" align="right" src="icon-fb-gray-58.png"></a>
<a href="https://twitter.com/mnmnotmail" ><img height="36" align="right" src="icon-tw-gray.svg"></a> &nbsp;

### Why I volunteered to re-architect Internet email

_by Liam Breck, Menlo Park, California_ &ndash; January 2021

The short answer to "Why?" is startling.
Email must be replaced. SMTP should be blocked on public networks.

At first, these sound like crazy assertions.
But consider that at least 9% of one billion knowledge workers[^1] have abandoned email 
whenever possible for Slack, MS Teams, and other SaaS & intranet messaging applications.

Email is going extinct, because phishing has made it a universal cybercrime portal.
Consumers, organizations, governments, and specific individuals are being targeted relentlessly
for the purposes of stealing money and confidential data, or planting malware.
Email technology offers no effective means to stop phishing[^2],
so it's been a runaway success for the attackers, and a disaster for millions of victims.

But _email the concept_ is too important to let corporate agendas define its future.
Email is a foundational Internet application.
Therefore the open source community must act to replace it, and ___act now___.

So I've drafted a protocol, TMTP[^3], 
and published implementations of both client[^4] and server[^5] as open source.
TMTP is simple, and preserves the soul of email, while dramatically reducing its vulnerabilities.
So how did I arrive here?

In 2002, after I left the Internet startup I founded in Silicon Valley (Synchron Networks), 
I began thinking and writing about how one would design an offline personal computing environment 
based on the Web user experience&mdash;hyperlinked, multi-format documents.
Its apps and data would be local to your device, but sharable with others.
I sourced one design element from software version control, 
that each set of related edits to a collection of local-web documents is packaged as a revision.
When saved, a revision is distributed via a store-and-forward Internet service to all others sharing the collection.

In 2010-12, I prototyped this in Node.js, as project Elembe.
It worked well enough, but it was a platform, not an application, 
and I couldn't see the killer app which would make it fly.
So I set it aside, and pursued a pocket-server hardware concept, another dimension to post-Web personal computing.
(That was an eventful misadventure, which I'll happily recount in person over drinks.)

In the Spring of 2017, I had a revelation&mdash;I don't recall what triggered it.
_Holy cow, the killer app... It's email!_
I'd unconciously realized that email would not survive the cybercrime crisis;
a new protocol would be required, and I'd already prototyped it.
I also recognized that a for-profit startup probably couldn't convince the world to adopt a new email protocol.
The central concern of a for-profit venture is to enrich its owners.
My sole motivation would have to be making the Internet safer, while keeping it open.

Three months later, I had a working server in Go, a protocol outline, a short essay titled "Why TMTP?" 
and a modest to-do list.
I called it "mnm" (mnm is not mail, a self-referential acronym).
I considered announcing the project then, but decided that it would be more credible and appealing 
given a client application with features missing in today's email.
So I composed a client to-do list, which quickly ballooned past modesty.
In Spring 2019, I released the first preview to a small audience, 
and as of January 2021, there have been eight more preview releases.

At this stage, TMTP & mnm need your support to reach v1.0. That means:
- Donors: support me on Patreon (I can't keep coding without food :-)
- Contributors: mnm needs code review, more test cases, and many more features.
- Evangelists: put the word out on blogs, social media, and discussion forums!


[^1] Derived from daily active users metrics for Slack and MS Teams as of December 2020.

[^2] Many warned the IETF that spam, the forefather of phishing, was a serious problem, 
and should be addressed at the protocol level, even at significant cost.
Sadly, some IETF participants derided such critics as "anti-spam kooks", 
and their suggestions as "FUSSPs" (final, ultimate solutions to the spam problem).
See the [rhyolite.com kooks list](https://www.rhyolite.com/anti-spam/you-might-be.html){:target="_blank"}.

[^3] [TMTP protocol draft](https://github.com/networkimprov/mnm/blob/master/Protocol.md){:target="_blank"}

[^4] [mnm TMTP client](https://github.com/networkimprov/mnm-hammer){:target="_blank"}

[^5] [mnm TMTP server](https://github.com/networkimprov/mnm){:target="_blank"}
