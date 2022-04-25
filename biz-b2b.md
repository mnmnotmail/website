<script src="//gc.zgo.at/count.js" async
        data-goatcounter="https://mnmnotmail.goatcounter.com/count"></script>

<div style="text-align:center">
   <a href="/"><img align="left" style="margin-top:-12px" src="logo-48-bleed-bright.png">
      <div style="float:left; margin-left:-0.75em; font-weight:bold; color:#888">m.n.m</div></a>
   <a href="https://dev.to/mnmnotmail"      ><img height="36" align="right" src="icon-dev-gray.svg"></a>
   <a href="https://facebook.com/mnmnotmail"><img height="36" align="right" src="icon-fb-gray-58.png"></a>
   <a href="https://twitter.com/mnmnotmail" ><img height="36" align="right" src="icon-tw-gray.svg"></a>
   <a href="/faq.html">FAQ</a> &bull;
   <a href="/demo.html">Demo</a> &bull;
   <a href="/#download--startup">Download</a> &bull;
   <a href="/#got-an-issue-idea-insight">Contact</a>
</div>

## TMTP Messaging for Critical B2B Comms

_A business case based on the "mnm" open source project. (Draft, 21-Apr-2022)_

### Market

Companies that provide essential services to businesses and professionals:

- Banking, Payment processing
- Legal, Accounting, Insurance
- Web hosting, IT, SaaS
- Telecom, Utilities
- Shipping, Order fulfillment
- Contract manufacturing
- Premises security

Initial verticals: (TBD)

See also the [__Business Questionnaire__](/bizq.html).

The B2B comms market provides a bridge into even larger ones; see [_Mid- to Long-term Opportunities_](#mid--to-long-term-opportunities) below.

### Problem

Companies that provide vital services constantly send time-sensitive and private information to customers, and respond to requests for support.
Today, such communication is largely mediated by third parties, like email hosts and social media sites.
Companies only have direct, secure links with customers during client-initiated browser sessions, 
and in some cases via custom phone apps.

In the context of critical comms between businesses, third parties add negative value.

Email hosts misinterpret messages as spam, hiding them.
Email hosts and social media sites suffer outages, and regularly terminate user accounts without notice, often by accident.
Email and social media accounts are frequently stolen in cyberattacks.
Data sent via such services is typically stored online, so ceases to be accessible if you're unable to access the site/account.
Worse, these intermediaries are infamous for scanning all messages flowing across their systems, 
and their employees can gain unauthorized access to stored messages.

Because existing messaging platforms allow anyone on the Internet to contact you, 
global organized crime groups exploit them to attack businesses by posing as a customer or trusted service provider 
(aka phishing and social engineering).
Certain kinds of cryptocurrency have made cyberattacks incredibly lucrative.
Businesses' losses to cybercrime (in cash and confidential data) are soaring; loss estimates were ~$1 trillion in 2020 alone.

Although email is the predominant medium for critical B2B comms, 
its content model and user experience have been stagnant for a long time, 
which has made the custom phone app an alternative for businesses that can afford it (see Competition, below).
For example, email doesn't support these common forms of communication:
- making payments between contacts, and micro-payments to a site host
- sending a form/survey that the recipient can fill out and return *
- including a chart/graph which is drawn from an attached dataset
- referencing a different discussion thread or message with a hyperlink *
- formatting a message as a deck of slides or tabs *
- adding a new recipient to a long-running, multi-party thread *
- dropping out of a thread that's no longer of interest
- notifying contacts of online presence and out-of-office status *
- issuing task requests with a due-date, owner, subtasks, etc
- discussing & progressively revising a document (or set of docs)
- compiling a collection of related threads, tasks, documents, URLs, and wiki pages

(__*__ = Wholly or partly implemented in mnm v0.9)

### Solution

Decentralized, secure messaging, via an open protocol, for communication & correspondence between businesses 
(e.g. alerts, status updates, support requests, data transfers, purchase orders, payments).

TMTP, a new network protocol (implemented by an open source server & client), enables a private messaging network at any Internet site.
TMTP sites are members-only, and allow communications only among members of that site. 
Most orgs and independent professionals will be members of multiple TMTP sites operated by different business-critical services.

A single client app manages all your TMTP site accounts, but traffic originating at different sites is not intermixed 
(illustrated in the demo).
The client retains all data sent and received by the user.
The client also advances the UX of electronic correspondence in fundamental ways, by offering a fusion of email and the web.

A TMTP site will optionally forward messages to email accounts to facilitate archiving, and integration with other IT systems, e.g. CRM.

An open protocol is necessary because a single vendor can't satisfy the requirements of every market segment, 
or even all buyers within a segment.
(Paul Graham, among many others, has called for [a better email protocol](http://www.paulgraham.com/ambitious.html){:target="_blank"}.)

Companies that communicate time-sensitive and private information to customers will adopt this solution if 
security & reliability concerns require it, or their customers demand it, or it produces meaningful ROI.
The software will therefore offer a toolkit that helps a buyer increase their customers' satisfaction.

The widespread adoption of alternative messaging and discussion apps (used alongside email) 
demonstrates that people will embrace new comms tools that empower them in new ways.

### Competition

Some enterprises offer custom mobile phone apps which enable direct interactions with the user.
However these are very expensive to design/build & operate, and pose security and privacy risks to the user.
They're often badly designed, irritating users and limiting usage.
Many such apps don't store received data locally, so depend on connectivity to the network for any use.

Many companies send phone text messages (SMS) containing a website link where the recipient can view the actual message.
Users can't immediately determine anything about the notice, and may misinterpret it as spam or phishing.
It entails a customer-specific area (and database) on the website, which is expensive to build & operate, 
and a cyberattack target.

[WhatsApp](https://developers.facebook.com/products/whatsapp), from Facebook/Meta, 
offers a toolkit to help businesses connect with customers (especially consumers).
As a social media site, it has most of the problems listed above.

[PagerDuty](https://pagerduty.com/) provides a phone app to send/receive and respond to notifications.
However, it's designed for intra-organization incident management, not communications between companies. 

Below are other protocols in development, which have been offered as email replacements.
All of these assume that anyone must be able to contact you.
None attempts to address the numerous common use cases of email via structured message formats.
In other words, they misunderstand the problems of the vast majority of email users.

The [Mathematical Mesh](https://mathmesh.com), by Phillip Hallam-Baker, is centered on cryptographic key management, 
and implements a message protocol to let ppl share keys.
The author envisions that as a replacement for email, but his model has almost no overlap with TMTP.

[Ubikom](https://ubikom.cc/), by Leonid Gorkin, is focused on decentralized identity, 
and implements a message protocol as an example application.
The author sees that as a replacement for email, but his model also has almost no overlap with TMTP.

[Matrix](https://matrix.org), from startup New Vector Ltd, is designed for real-time/synchronous comms, 
and works by synchronizing data among federated servers and between servers & clients.
Its main competitors are Slack & WhatsApp.
It's a very complex protocol, and has little overlap with TMTP.

[XMTP](https://twitter.com/xmtp_) & [MyMailProtocol](https://twitter.com/MyMailProtocol) are cryptocurrency startups working on toll-road schemes, 
which are unlikely to catch on outside the blockchain community.

### Mid- to Long-term Opportunities

TMTP will spread into B2C use cases, including order creation, invoicing, and payments.
TMTP sites will be able to offer client-app UI skins that represent a corporate brand identity.
Many businesses feel obligated to maintain custom phone apps to maximize customer engagement,
even though they lack the resources to execute this well.
TMTP lets them avoid the costs and pitfalls of a custom app, without compromising the customer experience.

Employees in orgs using TMTP for critical B2B comms will organically adopt it for internal communications, 
especially within the knowledge workforce. 
There are ~1 billion worldwide knowledge workers. 
