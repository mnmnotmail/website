<a href="https://facebook.com/mnmnotmail"><img width="36" align="right" src="icon-fb-gray-58.png"></a>
<a href="https://twitter.com/mnmnotmail"><img width="36" align="right" src="icon-tw-gray.svg"></a> &nbsp;

### mnm is not mail

<img width="300" hspace="2" align="right" src="https://user-images.githubusercontent.com/458838/65545951-535f6980-decb-11e9-8f46-6122198097b0.png">  

To those battling cybercrime, __email is a jungle__. 
It allows anyone, anywhere, claiming any identity to send you any content, any number of times. 

To the rest of us, preoccupied with effective communication and productivity, __email is a desert__.

We've been adopting instant messaging, discussion boards, wikis, and other options for two decades. 
But email remains ubiquitous, because it's __decentralized__ and rests on __open standards__. 

To all who agree that it's time to retire email, the mnm project is building a legitimate replacement: 
a [client](https://github.com/networkimprov/mnm-hammer),
a [server](https://github.com/networkimprov/mnm), and 
a [simple protocol](https://github.com/networkimprov/mnm/blob/master/Protocol.md) between them. 

mnm has two major goals.

1. To provide a far safer correspondence model, where you:  
\+ choose the organizations/sites that relay your correspondence  
\+ select which members of a site can correspond with you  
\+ always know from which site a message originated  
\+ can block anyone with whom you've made contact  
\+ may leave a site and never see traffic from it again  

2. To offer capabilities missing in traditional email, including:  
\+ forms/surveys whose results are collected into tables  
\+ data-driven charts via [a JS chart library TBD]  
\+ slide deck layouts  
\+ hashtags and private tags  
\+ hyperlinks to messages &amp; other threads  
\+ message formatting &amp; layout via Markdown (aka CommonMark)  
\+ many more features to foster efficiency, creativity, focus, and understanding  

Further reading: [_Why TMTP?_](rationale.html) 


### Status

[_0 November 2020_ - v0.8](https://github.com/networkimprov/mnm-hammer/releases/latest)
is released for Windows 7+ & MacOS & Linux. It has been tested with Chrome & Firefox.  
_New:_

_20 April 2020_ -
v0.7 is released for Windows 7+ & MacOS & Linux. It has been tested with Chrome & Firefox.  
_New:_ slide deck layouts, replication to multiple PCs, simplified startup.


### Quick Start

You'll need Firefox or Chrome. (I endorse [Firefox](https://www.mozilla.org/en-US/firefox/) :-)

You'll need an invitation to a TMTP service. 
To run your own service, see the [mnm TMTP server](https://github.com/networkimprov/mnm).

#### Windows &nbsp; &bull; [_MacOS_](#macos) &nbsp; &bull; [_Linux_](#linux)

1. Download & save  
a) Click [mnm-app-windows-amd64-v0.8.0.zip](https://github.com/networkimprov/mnm-hammer/releases/download/v0.8.0/mnm-app-windows-amd64-v0.8.0.zip).  
b) In the browser downloads list, find the above file and click "Open File".  
c) Drag the item `mnm-app-v0.8.0` to the `Downloads` folder in the left-hand pane.

1. If a previous version is running  
a) Go to its log window and press _Ctrl-C_ and then _Y_ to stop it.

1. Start app  
a) Open the `mnm-app-v0.8.0` folder now in `Downloads`, and double-click `App` (aka `App.cmd`).  
b) You'll see a notice, either  
b.1) "Windows protected your PC..." Click "More info" and then "Run anyway".  
b.2) "The publisher could not be verified..." Click "Run".  
c) You'll see a system notice, "Do you want to allow ...?" Click "Yes".  
+&nbsp; You'll see the mnm log window.  
+&nbsp; If you have a previous version in `Downloads`, it will offer to update it.  
+&nbsp; If the app fails, it will offer to restart it.  
+&nbsp; To stop the app, press _Ctrl-C_ and then _Y_ (closes the window).

1. Connect Firefox or Chrome  
a) Right-click [localhost:8123](http://localhost:8123/), and select "Open link in new tab".  
+&nbsp; You'll see the landing page, with a tour.

#### MacOS

1. Download & save  
a) Click [mnm-app-macos-v0.8.0.tgz](https://github.com/networkimprov/mnm-hammer/releases/download/v0.8.0/mnm-app-macos-v0.8.0.tgz).  
b) In the browser downloads list, find the file above and click "Open File".

1. If a previous version is running  
a) Go to its log window and press _Ctrl-C_ to stop it, then close the window.

1. Start app  
a) Open the `mnm-app-v0.8.0` folder now in `Downloads`, Ctrl-click on `App`, and select "Open".  
b) You'll see a notice, "_App_ is from an unidentified developer..." Click "Open".  
+&nbsp; You'll see the mnm log window.  
+&nbsp; If you have a previous version in `Downloads`, it will offer to update it.  
+&nbsp; If the app fails, it will offer to restart it.  
+&nbsp; To stop the app, press _Ctrl-C_, then close the window.

1. Connect Firefox or Chrome  
a) Ctrl-click (or two-finger tap) [localhost:8123](http://localhost:8123/), and select "Open link in new tab".  
+&nbsp; You'll see the landing page, with a tour.

#### Linux

1. Download & save  
a) Click [mnm-app-linux-amd64-v0.8.0.tgz](https://github.com/networkimprov/mnm-hammer/releases/download/v0.8.0/mnm-app-linux-amd64-v0.8.0.tgz).  
b) Extract the downloaded file, e.g. `tar xzf mnm-app-linux-amd64-v0.8.0.tgz`

1. If a previous version is running  
a) Go to its log window and press _Ctrl-C_ to stop it.

1. Start app  
a) Open the extracted `mnm-app-v0.8.0` folder, and double-click `App`.  
+&nbsp; You'll see the mnm log window.  
+&nbsp; If you have a previous version in the parent folder, it will offer to update it.  
+&nbsp; If the app fails, it will offer to restart it.  
+&nbsp; To stop the app, press _Ctrl-C_ (closes the window).

1. Connect Firefox or Chrome  
a) Right-click [localhost:8123](http://localhost:8123/), and select "Open link in new tab".  
+&nbsp; You'll see the landing page, with a tour.


### Installation Notes

On Windows, the app needs Administrator privileges to create symlinks and configure the firewall. 
`App.cmd` creates the firewall configuration. To inspect it, run:  
`netsh advfirewall firewall show rule name=mnm-hammer verbose`

To start the app using a different TCP port, run:  
MacOS & Linux (as any user): `./mnm-hammer -http :8123`  
Windows (as administrator): `mnm-hammer.exe -http :8123`

Updating from a previous version moves the folder `mnm-app-v0.X.0/store` to the new version, 
and leaves the previous version otherwise untouched. 
Launching `App.cmd` or `App` in the previous version will offer to update to it, 
moving the `store` folder back again (not recommended).
