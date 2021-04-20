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
   <a href="https://www.patreon.com/networkimprov" title="Support mnm on Patreon"
      style="border-radius:9999px; padding:0.6em 1em; background-color:#ff424d; color:#fff; text-decoration:none; white-space:nowrap;"
      ><img src="icon-pat-white-1080.png" height="16" style="margin-right:0.4em; vertical-align:-0.2em; height:1.1em">Become a patron</a>
</div>

### Frequently Asked Q's

_Stuff you wanted to know, and weren't afraid to ask_

1. __Why should we adopt a new email protocol?__

   Email has become a universal cybercrime portal, 
   because it makes you accessible to everyone else on the Internet without limits, 
   and thereby facilitates phishing and other social engineering attacks.
   (Most phishing attempts originate at authenticated senders.)
   The only effective solution is to block SMTP on public networks.

   See also [_Why TMTP?_](rationale.html)

1. __How can TMTP grow to replace SMTP, given how entrenched it is?__

   If SMTP is so deeply entrenched due to "network effects," 
   why are there so many other successful messaging and discussion apps?

   Initially, TMTP can handle internal correspondence 
   at organizations where a phishing attack could be catastrophic (e.g. 
   manufacturing, public infrastructure, government, finance, R&D, IT).
   And it can handle external correspondence for services whose members dislike 
   the message scanning done by webmail apps for advertising purposes (e.g. 
   legal affairs, health care, job search, family matters).

   As more sites adopt TMTP for their own reasons, 
   they'll begin using it to communicate with each other for B2B purposes, in lieu of email.
   As B2B use grows, those organizations that serve consumers can offer them TMTP accounts.

   Consumers will then start to ask for TMTP accounts everywhere they still need email, including work.
   Once enough consumers have switched over, 
   sites can begin requiring TMTP for all external electronic correspondence.

1. __What is the architecture of TMTP?__

   Succinctly stated: client-server, store-and-forward, members-only.
   All sent and received data is stored on the clients; the server does not retain messages after delivery.
   The organization that established a TMTP service controls who can register clients with it;
   only registered clients are allowed to connect.
   If a member registers multiple clients, the server forwards messages to all of them.
   The client-server links support both sending and receiving messages.

   A user is expected to have memberships at numerous sites, as in the real world.
   At each server, the user has a separate membership identity, and one or more human-readable aliases associated with it.
   The server constrains aliases, e.g. minimum number of characters, no duplicates.

   TMTP defines no server-to-server aspect.
   Where a site needs to analyze or archive correspondence by its members with other sites,
   its server could act as a proxy client (not yet defined in protocol draft).

   TMTP relies on a secure stream protocol to carry its traffic.
   That generally means TCP+TLS, but HTTPS could also work, 
   given a mechanism whereby the server can alert the client (see #7 re mobile clients).
   For stronger security, a TMTP server could be configured to require client-side TLS certificates.

   See also [_Supplanting SMTP_](rationale.html#supplanting-smtp).

1. __Does TMTP enable a universal identity, the way email does?__

   No, it provides site-specific identities.
   However, "marketplace" sites which offer membership to large segments of the public 
   may serve as common identity providers; for instance, 
   a consortium of professional organizations, 
   or a service that verifies real-world identity and background.

   The issue of universal identity is complex, and should not be defined within a messaging protocol.
   If a separate universal identity system is widely adopted, 
   TMTP servers could accept a universal identity string as a user registration credential.

1. __Does TMTP provide end-to-end encryption (E2EE)?__

   Not yet, but it's planned. 
   E2EE wouldn't be the default for all TMTP sites, as there are legitimate reasons 
   why a site would need to analyze or archive traffic among its members.

   E2EE is not as important for TMTP as it is for SMTP.
   When the Internet was emerging, its constituent networks weren't online continuously, 
   therefore email between networks had to be stored at each relay node until the next one was accessible.
   That exposes the message content to every node in the path, 
   regardless of any encryption at the transport layer.
   TMTP (like HTTP) simply assumes a robust Internet.

1. __Why doesn't TMTP offer federation between servers?__

   It isn't necessary, and it would open an easily exploited social engineering pathway.
   When you receive an invitation to correspond or a message, 
   you need to know who has control over the sender's stated identity.
   If it's your organization, it's trustworthy. 
   If it's a vendor you buy from, it may not be.
   If it's a semi-public service that verifies real-life identities, do you trust its verification?

   Furthermore, your home provider in a federated network can accidentally or intentionally cut off your service, 
   and record all of the sites you correspond with, 
   and read or copy all the content you receive or send, 
   and even impersonate you in messages to anyone.

   See also #4, re universal identity.

1. __How does TMTP support mobile clients with variable-quality Internet connections?__

   The protocol draft needs work in this area.
   JMAP specifies a client-side listener which the server can ping 
   to prompt the client to reconnect for pending messages.
   That could be a template for a TMTP feature.

1. __Why does the [TMTP protocol draft](https://github.com/networkimprov/mnm/blob/master/Protocol.md) 
define both message delivery and message body formatting?__

   The definition of acceptable message formats could be a separate protocol, 
   but for now, there's one protocol draft.

   The server doesn't enforce the protocol for message formatting 
   (see protocol op "Post" under ".datahead segment").
   Special-purpose clients that don't send messages to normal clients 
   can use whatever message format suits them.

1. __Couldn't one implement all these features on the existing email protocol stack?__

   Goodness, no. Have you read the protocol draft?

1. __Doesn't another protocol already provide these features, e.g. Matrix or JMAP?__

   Matrix & JMAP are synchronization protocols, 
   wherein both sides maintain a copy of the data objects in question.
   Matrix is federated (see #6 re federation) and highly complex.
   JMAP is an extension of the email protocol stack, fitting between user apps and email hosts.

1. __Will TMTP be standardized; if so, when?__

   Yes, after we gain real-world experience with the protocol, 
   and have a community of folks who want to see it codified.

1. __Is "mnm" really the best name for the project?__

   Good question! I think it rolls off the tongue nicely.
   And the general public might get a kick out of the self-referencing quirk, which is new to them.
   Plus you can invent your own names from the acronym; it's _Massive New Mail!_

<!--1. __How did you decide to work on this?__

   Thought you'd never ask! Read [_How I volunteered to re-architect Internet email_](volunteered.html).-->

---
To pose a question not addressed above, feel free to open or comment on an issue:

- [Re the TMTP protocol](https://github.com/networkimprov/mnm/issues)
- [Re the mnm client app](https://github.com/networkimprov/mnm-hammer/issues)
- [Re the mnm TMTP server](https://github.com/networkimprov/mnm/issues)
