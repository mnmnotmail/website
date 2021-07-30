<script src="//gc.zgo.at/count.js" async
        data-goatcounter="https://mnmnotmail.goatcounter.com/count"></script>

<p style="text-align:center">
   <a href="/"><img align="left" style="margin-top:-12px" src="logo-48-bleed-bright.png"></a>
   <a href="https://dev.to/mnmnotmail"      ><img height="36" align="right" src="icon-dev-gray.svg"></a>
   <a href="https://facebook.com/mnmnotmail"><img height="36" align="right" src="icon-fb-gray-58.png"></a>
   <a href="https://twitter.com/mnmnotmail" ><img height="36" align="right" src="icon-tw-gray.svg"></a>
   <a href="/rationale.html">Why?</a> &bull;
   <a href="/faq.html">FAQ</a> &bull;
   <a href="/demo.html">Demo</a>
</p>

<div style="margin:3.1em 2px 1.5em 22px; width:300px; max-width:45%; float:right; clear:both; text-align:center;">
   <a href="https://www.patreon.com/networkimprov" title="Support mnm on Patreon" style="border-radius:9999px; padding:0.6em 1em; background-color:#ff424d; color:#fff; text-decoration:none; white-space:nowrap;"><img src="icon-pat-white-1080.png" height="16" style="margin-right:0.4em; vertical-align:-0.2em; height:1.1em">Become a patron</a>
</div>

### How I volunteered to re-architect Internet email

_by Liam Breck, Menlo Park, California &ndash; January 2021_

SMTP should be blocked on public networks.

Sound crazy? Consider this: Email is now a universal cybercrime portal[^cp].
Consumers, organizations, governments, and specific individuals are being targeted relentlessly
by phishing attacks that result in stolen money and confidential data, or planted malware.
Email technology offers no effective means to stop phishing[^sp],
so it's been a runaway success for the attackers, and a disaster for millions of victims.
Accepting this state of affairs&mdash;now _that's_ crazy.

Furthermore, a majority of email users are plugged into other messaging services, 
discussion sites, and groupware apps.
At least 90 million[^90] have replaced email where possible with Slack and MS Teams.
We no longer need an Internet-wide messaging system that makes everyone on it 
accessible by everyone else without consent or limits.

Sunsetting SMTP is clearly necessary and feasible.
But email is a foundational Internet application[^ia]; 
the _concept_ is too important to let SaaS vendors or social networks define its future.
Therefore the open source community must act to replace it, and ___act&nbsp;now___.

So I've drafted a protocol, TMTP[^t], 
and published implementations of both client[^c] and server[^s] as open source.
TMTP is simple, preserving the soul of email, while dramatically reducing its vulnerabilities.
It also addresses major user experience gaps in email, 
which were solved long ago by web-based discussion apps.

I arrived here by trying to build something completely different.

In 2002, after I left the Internet startup I founded in Silicon Valley, Synchron Networks, 
I began exploring a design for a personal-area computing environment[^ce] 
based on the Web user experience (hyperlinked, multi-format, interactive documents).
Its apps and data are local to your devices, but sharable with collaborators and subscribers.
I sourced one element from software version control, 
that related edits to a collection of local-web documents are packaged as a revision.
When saved, a revision is distributed via a store-and-forward Internet service 
to all others sharing the collection.
I borrowed another aspect from the datacenter, 
that all your local-web projects (shared and not) are replicated on a few devices, 
so you can failover to a different device without loss of work.

In 2010-12, I prototyped this in Node.js.
It worked well enough, but it was a platform, not an application, 
and I couldn't see a killer app which would make it fly.
So I set it aside, and created a pocket-server hardware product, 
another dimension to personal-area computing.
(That was an enlightening misadventure, which I'll cheerfully recount over drinks.)

In the Spring of 2017, I had a revelation&mdash;I don't recall what triggered it.
_Holy cow, the killer app... It's email!_
I'd unconciously realized that email could not survive the cybercrime crisis;
a new protocol would be required, and I'd already prototyped it.
I also recognized that a typical tech startup probably couldn't convince the world 
to adopt a new email protocol.
The central concern of a for-profit outfit is enriching its owners by satisfying customers.
My sole motivation has to be making the Internet safer, while keeping it open.

Three months later, I had a working server in Go, a protocol outline, 
a short essay titled "Why TMTP?" and a modest to-do list.
I named it "mnm" (mnm is not mail, a self-referencing acronym).
I considered announcing the project then, but decided that it would be more credible and appealing 
given a client application with features missing in today's email.
So I composed a client to-do list, which quickly ballooned past modesty, and started learning Vue.js.
In Spring 2019, I released the first preview to a small audience, 
and as of this writing, there have been nine preview releases.

At this stage, __TMTP & mnm need your support__ to reach v1.0. That means:
- Donate: [support me on Patreon](https://www.patreon.com/networkimprov){:target="_blank"} (I'm getting hungry!)
- Contribute: add features, perform code reviews, and invent new test cases.
- Experiment: try the client & server in different environments, and report back.
- Evangelize: put the word out on blogs, social media, and discussion forums!

Please volunteer!
We have a rare opportunity to make a lasting contribution to the 21st Century Internet.

<div style="float:right" markdown="1">

Follow mnm: 
[Twitter](https://twitter.com/mnmnotmail){:target="_blank"} &ndash; 
[DEV](https://dev.to/mnmnotmail){:target="_blank"} &ndash; 
[Facebook](https://facebook.com/mnmnotmail){:target="_blank"}

</div>
<hr style="clear:both">

[^cp]: Phishing sites tripled during Q3 2019 to Q3 2020, per the 
    [APWG trends reports](https://apwg.org/trendsreports/){:target="_blank"}.
    Susceptibility to phishing averaged 21% in a 
    [meta-analysis of field experiments](https://docs.apwg.org/ecrimeresearch/2019/Nov15_HenrikKarlzen.pdf){:target="_blank"}.

[^sp]: Many warned the IETF that spam, the forefather of phishing, was a serious problem, 
    and should be addressed at the protocol level, even at significant cost.
    Sadly, some IETF participants derided such critics as "anti-spam kooks", 
    and their suggestions as "FUSSPs" (final, ultimate solutions to the spam problem).
    See the [rhyolite.com kooks list](https://www.rhyolite.com/anti-spam/you-might-be.html){:target="_blank"}.

[^90]: Derived from daily-active-users figures for Slack and MS Teams as of December 2020.

[^ia]: Email cannot be replaced by chatrooms, which can be useful, but also yield negative effects; 
    see the [Media Diet Slack syllabus](https://mediadiet.com/slack.html){:target="_blank"}.

[^t]: [TMTP protocol draft](https://github.com/networkimprov/mnm/blob/master/Protocol.md){:target="_blank"}
    &ndash; see also [Supplanting SMTP](https://mnmnotmail.org/rationale.html#supplanting-smtp)

[^c]: [mnm client on Github](https://github.com/networkimprov/mnm-hammer){:target="_blank"}
    &ndash; see also the [release history](https://github.com/networkimprov/mnm-hammer/releases){:target="_blank"}

[^s]: [mnm server on Github](https://github.com/networkimprov/mnm){:target="_blank"}
    &ndash; see also the [release history](https://github.com/networkimprov/mnm/releases){:target="_blank"}

[^ce]: I've long been inspired by Mark Weiser's Ubiquitous Computing research at Xerox PARC in the early 90's.
    See [his Wikipedia page](https://en.wikipedia.org/wiki/Mark_Weiser){:target="_blank"}.
