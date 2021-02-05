// Copyright 2017, 2019 Liam Breck
// Published at https://github.com/networkimprov/mnm-hammer
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

;var mnm = {};

(function() {
   var sUrl = 'ws://'+ location.host +'/s/'+ location.pathname.split('/')[1];
   var sTouchSeen = 's'.charCodeAt(0);
   var sTouchTag = 't'.charCodeAt(0);
   var sTouchUntag = 'u'.charCodeAt(0);
   var sWs = {};
   var sXhrPending = 0;
   var sNotice = '';

   // caller implements these
   mnm.Log =
   mnm.Err =
   mnm.Quit =
   mnm.Render =
   mnm.HasMoId =
   mnm.ThreadChange = null;

   mnm.ConfigUpdt = function(iObj) { // with addr, verify
      mnm.Err('config update not enabled in demo');
   };

   mnm.OhiAdd = function(iAliasTo, iUid) {
      for (var a=0; a < sSvc.ot.length; ++a)
         if (sSvc.ot[a].Alias === iAliasTo)
            return;
      sSvc.ot.unshift({Alias:iAliasTo, Uid:iUid, Date:luxon.DateTime.utc().toISO()});
      _render('ot');
   };
   mnm.OhiDrop = function(iUid) {
      for (var a = sSvc.ot.length-1; a >= 0; --a)
         if (sSvc.ot[a].Uid === iUid)
            sSvc.ot.splice(a, 1);
      _render('ot');
   };

   mnm.PingSave = function(iObj) { // with alias, to, text, gid
      for (var a=0; a < sSvc.ps.length; ++a)
         if (sSvc.ps[a].Alias === iObj.to && sSvc.ps[a].Gid === (iObj.gid || undefined))
            break;
      if (a === sSvc.ps.length)
         sSvc.ps.unshift({Alias:iObj.to, Gid:(iObj.gid || undefined), Text:(iObj.text || ''),
                          Date:luxon.DateTime.utc().toISO()});
      else
         sSvc.ps[a].Text = iObj.text;
      _render('ps');
   };
   mnm.PingDiscard = function(iObj) { // with to, gid
      for (var a = sSvc.ps.length-1; a >= 0; --a)
         if (sSvc.ps[a].Alias === iObj.to && sSvc.ps[a].Gid === iObj.gid)
            sSvc.ps.splice(a, 1);
      _render('ps');
   };
   mnm.PingSend = function(i) {
      mnm.Err('invite send not enabled in demo');
   };
   mnm.InviteAccept = function(i) {
      mnm.Err('invite accept not enabled in demo');
   };
   mnm.AdrsbkSearch = function(iType, iTerm) {
      iTerm = iTerm.toLowerCase();
      var aFound = ['_n'];
      for (var a=0; a < sSvc.A.length; ++a)
         if (sSvc.A[a][0].toLowerCase().startsWith(iTerm))
            aFound.push(sSvc.A[a][0], sSvc.A[a][1]);
      _render.apply(null, aFound);
   };

   mnm.NoticeOpen = function(iSvc) {
      sNotice = iSvc;
      _render('nlo', iSvc)
   };
   mnm.NoticeClose = function() {
      sNotice = ''
   };
   mnm.NoticeSeen = function(iMsgId) {
      for (var a=0; a < sSvc.nl.length; ++a)
         sSvc.nl[a].Seen = 1;
      var aV = sD['/v'];
      for (var a=0; a < aV.length; ++a)
         if (aV[a].Name === mnm.demoId)
            aV[a].NoticeN = 0;
      _render('/v', 'nlo', mnm.demoId);
   };

   mnm.NavigateThread = function(i) {
      _history(i);
      _render('cs', 'cl', '_t', 'al', 'ml', 'mo');
   };
   mnm.NavigateHistory = function(i) {
      sHpos += i;
      _history();
      _render('cs', 'cl', '_t', 'al', 'ml', 'mo');
   };
   mnm.NavigateLink = function(iLabel, iHref) {
      if (iLabel.length > 32) // also limited by ClientState.goLink()
         iLabel = iLabel.substring(0, 32) +'...';
      var aPair = iHref.substring(iHref.indexOf('#')+1).split('&');
      _wsSend({op:'navigate_link', navigate:{label:iLabel, threadId:aPair[0], msgId:aPair[1] || aPair[0]}})
      if (aPair[0] !== sSvc.cs.Thread)
         _history(aPair[0]);
      if (aPair[1]) {
         for (var a=0; a < sSvc.cs.ThreadTabs.Terms.length; ++a)
            if (sSvc.cs.ThreadTabs.Terms[a].Term === '&'+ aPair[1])
               break;
         if (a === sSvc.cs.ThreadTabs.Terms.length)
            sSvc.cs.ThreadTabs.Terms.push({Term:'&'+aPair[1], Label:iLabel});
         sSvc.cs.ThreadTabs.Terms[a].Label = iLabel;
         sSvc.cs.ThreadTabs.Pos = a;
         sSvc.cs.ThreadTabs.PosFor = 2;
      }
      _render('cs', 'cl', '_t', 'al', 'ml', 'mo');
   };

   mnm.ThreadNew = function(iObj) { // with alias, (cc), (data), (attach), (formFill)
      var aId = _makeId('');
      var aDate = luxon.DateTime.utc().toISO();
      sSvc.T[aId] = {
         cl: [[],
              [{"Who":sSvc.cf.Alias, "By":sSvc.cf.Alias,
                "WhoUid":sSvc.cf.Uid, "ByUid":sSvc.cf.Uid,
                "Date":aDate, "Note":"author", "Subscribe":true, "Queued":false}]] ,
         ml: [{"Id":aId, "From":"", "Alias":"",
               "Date":aDate, "Subject":"", "Seen":".", "Queued":false}] ,
         mo: {} ,
         al: [] ,
      };
      sSvc.T[aId].mo[aId] = {"Id":aId, "Size":0, "Posted":"draft", "From":"self",
                             "SubHead":{"Alias":sSvc.cf.Alias, "ThreadId":aId, "Subject":""},
                             "msg_data":""};
      sSvc.tl.unshift({"Id":aId,"Count":0,"Subject":"","OrigCc":[],
                       "OrigDate":aDate,"LastDate":aDate,
                       "OrigAuthor":sSvc.cf.Alias,"LastAuthor":""});
      _history(aId);
      _render('cs', 'tl', '_T', 'cl', 'al', 'ml', 'mo');
   };
   mnm.ThreadReply = function(iObj) { // with alias, (data), (attach), (formFill)
      var aT = sSvc.T[sSvc.cs.Thread];
      var aEl = {Id:_makeId(sSvc.cs.Thread), Date:luxon.DateTime.utc().toISO(),
                 From:'', Alias:'', Subject:iObj.subject, Seen:'.', Queued:false};
      aT.ml.unshift(aEl);
      aT.mo[aEl.Id] = {Id:aEl.Id, Size:0, Posted:'draft', From:'self',
                       msg_data:iObj.data, form_fill:iObj.formFill,
         SubHead:{Alias:iObj.alias, Subject:iObj.subject, ThreadId:sSvc.cs.Thread, Attach:iObj.attach}};
      if (iObj.attach)
         aT.al.unshift({Date:aEl.Date, File:iObj.attach[0].Name, Id:iObj.attach[0].FfKey,
                        MsgId:aEl.Id, Size:2, Who:''});
      _tlSubject(aT);
      _render('tl', 'al', 'ml', 'mn', aEl.Id);
   };
   mnm.ThreadSave = function(iObj) { // with id, alias, (cc), (data), (attach), (formFill)
      var aFormFill = iObj.FormFill && JSON.parse(JSON.stringify(iObj.FormFill));
      var aAttach = iObj.Attach && JSON.parse(JSON.stringify(iObj.Attach));
      var aT = sSvc.T[iObj.Id[0] === '_' ? iObj.Id : iObj.Id.slice(0, 16)];
      var aEl = aT.ml.find(function(c) { return c.Id === iObj.Id });
      aEl.Subject = iObj.Subject;
      aT.mo[iObj.Id].msg_data = iObj.Data;
      aT.mo[iObj.Id].form_fill = aFormFill;
      aT.mo[iObj.Id].SubHead.Attach = aAttach;
      aT.mo[iObj.Id].SubHead.Subject = iObj.Subject;
      aT.cl[1] = iObj.Cc && JSON.parse(JSON.stringify(iObj.Cc));
      _tlSubject(aT);
      if (aAttach) {
         var aLms = iObj.Id.slice(iObj.Id.length-12);
         for (var a = aT.al.length-1; a >= 0; --a)
            if (!aAttach.find(function(c) { return aLms +'_'+ c.Name === aT.al[a].Id }))
               aT.al.splice(a, 1);
         for (var a in aFormFill)
            if (!aAttach.find(function(c) { return c.FfKey === a }))
               delete aFormFill[a];
         var aUpload = sD['/t'], aForm = sD['/f'];
         for (var a=0; a < aAttach.length; ++a) {
            var aAtc = {Date:aEl.Date, MsgId:aEl.Id, Who:''};
            var aList = aAttach[a].Name.startsWith('upload/') ? aUpload :
                        aAttach[a].Name.startsWith('form/')   ? aForm   : null;
            if (aList) {
               aAttach[a].IsNew = true;
               if (aList === aForm)
                  aAttach[a].Ffn = sFfn;
               aAttach[a].Name = (aList === aForm ? 'f:' : 'u:') +
                                 aAttach[a].Name.slice(aList === aForm ? 5 : 7);
               for (var a1=0; a1 < aList.length; ++a1)
                  if (aList[a1].Name === aAttach[a].Name.slice(2))
                     aAtc.Size = aList[a1].Size;
            } else if (aAttach[a].Name.startsWith('form_fill/')) {
               aAttach[a].Ffn = sFfn;
               aAttach[a].Name = 'r:'+ aAttach[a].Name.slice(10);
               continue;
            } else {
               aAttach[a].IsNew = false;
               continue;
            }
            aAtc.File = aAttach[a].Name.slice(2);
            aAtc.Id   = aLms +'_'+ aAttach[a].Name;
            aT.al.unshift(aAtc);
         }
      }
      if (aT === sSvc.T[sSvc.cs.Thread])
         _render('tl', 'cl', 'al', 'ml', 'mn', iObj.Id);
      else
         _render('tl');
   };
   mnm.ThreadSend = function(iId) {
      mnm.Err('thread send not enabled in demo');
   };
   mnm.ThreadDiscard = function(iId) {
      if (iId[0] === '_') {
         delete sSvc.T[iId];
         sSvc.tl.splice(sSvc.tl.findIndex(function(c) { return c.Id === iId }), 1);
         for (var a = sHlist.length-1; a >= 0; --a) {
            if (sHlist[a] !== iId) continue;
            sHlist.splice(a, 1);
            if (a <= sHpos)
               sHpos -= 1;
         }
         _history();
         _render('cs', 'tl', '_t', 'cl', 'al', 'ml', 'mo');
      } else {
         var aT = sSvc.T[sSvc.cs.Thread];
         aT.ml.splice(aT.ml.findIndex(function(c) { return c.Id === iId }), 1);
         for (var a = aT.al.length-1; a >= 0; --a)
            if (aT.al[a].MsgId === iId)
               aT.al.splice(a, 1);
         delete aT.mo[iId];
         _tlSubject(aT);
         _render('tl', 'cl', 'al', 'ml', 'mo');
      }
   };

   mnm.ThreadOpen = function(iId) {
      var aT = sSvc.T[sSvc.cs.Thread];
      if (!(iId in aT.mo)) {
         for (var a=0; aT.ml[a].Id !== iId; ++a) {}
         aT.ml[a].Seen = luxon.DateTime.utc().toISO();
         aT.mo[iId] = {Id:iId, Size:23, Posted:'', From:"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                       msg_data:'A newly opened message.',
                       SubHead:{Subject:'', ThreadId:sSvc.cs.Thread, Alias:"Gold 0528233319"}};
         for (var a=0; sSvc.tl[a].Id !== aT.ml[aT.ml.length-1].Id; ++a) {}
         sSvc.tl[a].Unread = false;
         var aV = sD['/v'];
         for (var a=0; aV[a].Name !== sSvc.cf.Name; ++a) {}
         aV[a].UnreadN -= 1;
      }
      _render('/v', 'tl', 'ml', 'mn', iId)
   };
   mnm.ThreadClose = function(iId) {
      // no-op
   };
   mnm.ThreadTag = function(iId, iTag) {
      var aT = sSvc.T[sSvc.cs.Thread];
      for (var a=0; aT.ml[a].Id !== iId; ++a) {}
      if (!aT.ml[a].Tags)
         aT.ml[a].Tags = [];
      aT.ml[a].Tags.push(iTag);
      _render('tl', 'ml');
   };
   mnm.ThreadUntag = function(iId, iTag) {
      var aT = sSvc.T[sSvc.cs.Thread];
      for (var a=0; aT.ml[a].Id !== iId; ++a) {}
      aT.ml[a].Tags.splice(aT.ml[a].Tags.indexOf(iTag), 1);
      if (aT.ml[a].Tags.length === 0)
         aT.ml[a].Tags = undefined;
      _render('tl', 'ml');
   };

   mnm.ForwardSave = function(iId, iCc) {
      var aT = sSvc.T[sSvc.cs.Thread];
      aT.cl[0] = iCc;
      _render('cl');
   };
   mnm.ForwardSend = function(iId, iQid) {
      mnm.Err('forward send not enabled in demo');
   };

   mnm.TagAdd = function(iName) {
      sD['/g'].push({Id:luxon.DateTime.utc().toISO(), Name:iName});
      _render('/g');
   };

   mnm.TabAdd = function(iObj) { // with type, term
      var aTabs = iObj.type === 0 ? sSvc.cs.ThreadTabs : sSvc.cs.SvcTabs;
      aTabs.PosFor = 2;
      aTabs.Pos = aTabs.Terms.length;
      aTabs.Terms.push({Term:iObj.term});
      var aArg = iObj.type === 0 ? 'mo' : 'tl';
      _render('cs', aArg);
   };
   mnm.TabSelect = function(iObj) { // with type, posfor, pos
      var aTabs = iObj.type === 0 ? sSvc.cs.ThreadTabs : sSvc.cs.SvcTabs;
      aTabs.PosFor = iObj.posfor;
      aTabs.Pos = iObj.pos;
      var aArg = iObj.type === 0 ? 'mo' : 'tl';
      _render('cs', aArg);
   };
   mnm.TabPin = function(iType) {
      var aTabs = sSvc.cs.SvcTabs;
      aTabs.Pinned.push(aTabs.Terms[aTabs.Pos]);
      aTabs.Terms.splice(aTabs.Pos, 1);
      aTabs.PosFor = 1;
      aTabs.Pos = aTabs.Pinned.length - 1;
      _render('cs', 'tl');
   };
   mnm.TabDrop = function(iType) {
      var aTabs = iType === 0 ? sSvc.cs.ThreadTabs : sSvc.cs.SvcTabs;
      var aList = aTabs.PosFor === 1 ? aTabs.Pinned : aTabs.Terms;
      aList.splice(aTabs.Pos, 1);
      aTabs.PosFor = 0;
      aTabs.Pos = 0;
      var aArg = iType === 0 ? 'mo' : 'tl';
      _render('cs', aArg);
   };

   mnm.SortSelect = function(iType, iField) {
      sSvc.cs.Sort[iType] = iField;
      _render('cs');
   };

   mnm.NodeAdd = function(iAddr, iPin, iNewnode) {
      mnm.Err('replication not enabled in demo');
   };

   mnm.FileForm = function(iId, iCb) {
      _xhr('/ft', iId, iCb);
   };
   mnm.FileBlob = function(iId, iCb) {
      _xhr('/tb', iId, iCb);
   };

   mnm.AttachForm = function(iId, iCb) {
      _xhr('ant', iId, iCb);
   };
   mnm.AttachBlob = function(iId, iCb) {
      _xhr('anb', iId, iCb);
   };

   mnm.Upload = function(iForm, iCb) {
      switch (iForm.action[iForm.action.lastIndexOf('/')-1]) {
      case 't': mnm.Err('file add & delete not enabled in demo'); return;
      case 'f': mnm.Err('form add & delete & edit not enabled in demo'); return;
      case 'v': mnm.Err('account add not enabled in demo'); return;
      case 'l': break;
      default: throw new Error('mnm.Upload: unknown type');
      }
      var aL = sD['/l'];
      aL.Pin = aL.Pin ? '' : '123 234 012';
      _render('/l');
   };

   mnm.Connect = function() {
      if (mnm.demoId === 'local') {
         _render('/v', '/t', '/f', '/g', '/l');
      } else {
         sSvc = sD.S[mnm.demoId];
         sHlist[sHpos = 0] = sSvc.cs.Thread;
         _render('/v', '/t', '/f', '/g', '/l',
                 'cs', 'cf', 'cn', 'tl', 'fl', 'ps', 'pt', 'pf', 'gl', 'ot', 'of',
                 'cl', '_t', 'al', 'ml', 'mo');
      }
/*      sWs = new WebSocket(sUrl);
      sWs.onopen = function() {
         sWs.send(JSON.stringify({op:'open'}));
      };
      sWs.onmessage = function(iEvent, iMs) {
         if (sXhrPending > 0) {
            setTimeout(sWs.onmessage, 6, iEvent, iMs || Date.now());
            mnm.Log('ws message deferred for pending xhr');
            return;
         }
         if (iMs) //todo verify that deferred msgs are handled in order
            mnm.Log('ws handle deferred from '+ iMs);
         mnm.Log('ws '+ iEvent.data);

         var aObj = JSON.parse(iEvent.data);
         for (var a=0; a < aObj.length; ++a) {
            if (aObj[a] === '_n') {
               mnm.Render('nameset', null, aObj.slice(a+1));
               break;
            }
            switch (aObj[a]) {
            case '_t': case '_T':  mnm.ThreadChange(aObj[a] === '_T'); break;
            case '_e':             mnm.Err(aObj[++a]);                 break;
            case 'mn': case 'an':  _xhr(aObj[a], aObj[++a]);           break;
            case '_m':
               var aOld = aObj[++a], aNew = aObj[++a];
               if (mnm.HasMoId(aOld === '' ? aNew : aOld))
                  _xhr('mn', aNew);
               break;
            default:
               _xhr(aObj[a]);
               if (aObj[a] === '/v' && sNotice)
                  _xhr('nlo', sNotice);
            }
         }
      };
      sWs.onclose = function(iEvent) {
         mnm.Log('ws closed');
         mnm.Quit();
      };
      sWs.onerror = function(iEvent) {
         mnm.Log('ws error: ' + iEvent.data);
         mnm.Err(iEvent.data);
      }; */
   };

   function _xhr(i, iId, iCb, iOpen) {
      ++sXhrPending;
      var aXhr = new XMLHttpRequest();
      if (iCb) {
         aXhr.responseType = i[2] === 'b' ? 'blob' : '';
         i = i.slice(0, 2);
      } else if (i === 'mo' || i === 'mn') {
         aXhr.responseType = 'arraybuffer';
      }
      aXhr.onload = function() {
         --sXhrPending;
         if (aXhr.status !== 200) {
            var aTxt = (iId ? iId +' ' : '') +
                       (aXhr.responseType === 'arraybuffer' ? _decode(aXhr) :
                        aXhr.responseType === 'blob' ? aXhr.statusText : aXhr.responseText);
            mnm.Log('get '+ i +' '+ aTxt);
            mnm.Err(aTxt);
            return;
         }
         if (i !== 'mo' && i !== 'mn') {
            if (iCb)
               iCb(aXhr.response, iId);
            else
               mnm.Render(i, aXhr.responseText, iId);
            return;
         }
         var aMap = {};
         for (var a=0; a < aXhr.response.byteLength; ++a) {
            var aHeadLen = parseInt(_decode(aXhr, a, 4), 16);
            var aHead = JSON.parse(_decode(aXhr, a+4, aHeadLen));
            var aMsgLen = 'Size' in aHead ? aHead.Size : aHead.Len; // .Size appears in v0.8.0
            aHead.msg_data = _decode(aXhr, a+4+aHeadLen+1, aMsgLen);
            a += 4 + aHeadLen + 1 + aMsgLen;
            if (aHead.From === 'self' && aHead.SubHead.Attach) {
               aHead.form_fill = null;
               var aFormFill = {};
               var aAtc = aHead.SubHead.Attach;
               for (var aA=0; aA < aAtc.length; ++aA) {
                  if (!/^r:/.test(aAtc[aA].Name))
                     continue;
                  aFormFill[aAtc[aA].FfKey] = _decode(aXhr, a, aAtc[aA].Size);
                  a += aAtc[aA].Size;
                  aHead.form_fill = aFormFill;
               }
            }
            if (i === 'mn') {
               mnm.Render(i, null, aHead);
               if (iOpen)
                  _wsSend({op:'thread_open', touch:{act:sTouchSeen, msgid:aHead.Id,
                                                    threadid:aHead.SubHead.ThreadId || aHead.Id}});
               return;
            }
            aMap[aHead.Id] = aHead;
         }
         mnm.Render(i, null, aMap);
      };
      if (i === 'nlo') {
         aXhr.open('GET', '/'+ encodeURIComponent(iId) +'?nl');
      } else {
         if (i === 'an') {
            var aN = iId.slice(iId.indexOf('_')+1);
            i = aN[0] === 'f' ? '/f' : '/t';
            aN = encodeURIComponent(aN.slice(2));
         } else {
            var aN = iId ? encodeURIComponent(iId) : '';
         }
         aXhr.open('GET', i.charAt(0) === '/' ? i+'/'+aN : '?'+i+(aN && '='+aN));
      }
      aXhr.send();
   }

   function _wsSend(i) {
      if (sWs.readyState !== 1) {
         mnm.Log('ws op failed on closed socket');
      } else {
         sWs.send(JSON.stringify(i));
      }
   }

   var sUtf8 = new TextDecoder();
   function _decode(iXhr, iPos, iLen) {
      return sUtf8.decode(new Uint8Array(iXhr.response, iPos, iLen));
   }

   function _tlSubject(iT) {
      for (var a=0; sSvc.tl[a].Id !== iT.ml[iT.ml.length-1].Id; ++a) {}
      sSvc.tl[a].Subject       = iT.ml[0].Subject || iT.ml[iT.ml.length-1].Subject;
      if (iT.ml.length > 1)
         sSvc.tl[a].SubjectWas = iT.ml[0].Subject  ? iT.ml[iT.ml.length-1].Subject : undefined;
   }

   function _history(iTid) {
      if (iTid) {
         if (iTid === sSvc.cs.Thread)
            return;
         sHlist.length = ++sHpos + 1;
         sHlist[sHpos] = iTid;
      }
      sSvc.cs.Thread = sHlist[sHpos];
      sSvc.cs.History.Prev = sHpos > 0;
      sSvc.cs.History.Next = sHpos < sHlist.length - 1;
      sSvc.cs.ThreadTabs.PosFor = 0;
      sSvc.cs.ThreadTabs.Pos = 0;
      sSvc.cs.ThreadTabs.Terms = [];
   }

   function _makeId(iTid) { return iTid +'_'+ ++sLocalId }

   function _render() { // arguments: same as a websocket msg from mnm-hammer
      var aArg = arguments;
      setTimeout(function() { _renderDing.apply(null, aArg) }, 60);
   }

   function _renderDing() {
      for (var a=0; a < arguments.length; ++a) {
         var aOp = arguments[a], aData = null, aId = null;
         switch (aOp) {
         case '_n':
            mnm.Render('nameset', null, Array.prototype.slice.call(arguments, a+1));
            return;
         case '_t': case '_T':
            mnm.ThreadChange(aOp === '_T');
            break;
         case '_e':
            mnm.Err(arguments[++a]);
            break;
         case '_m':
            var aOld = arguments[++a], aNew = arguments[++a];
            if (mnm.HasMoId(aOld === '' ? aNew : aOld))
               aOp = 'mn', aId = JSON.parse(JSON.stringify(sSvc.T[sSvc.cs.Thread].mo[aNew]));
            break;
         case 'mn':
            aId = JSON.parse(JSON.stringify(sSvc.T[sSvc.cs.Thread].mo[arguments[++a]]));
            break;
         case 'mo':
            if (sSvc.cs.ThreadTabs.PosFor === 2) {
               var aTerm = sSvc.cs.ThreadTabs.Terms[sSvc.cs.ThreadTabs.Pos].Term;
               var aTermV = aTerm.slice(1);
               var aT = sSvc.T[sSvc.cs.Thread];
               aId = {};
               switch (aTerm[0]) {
               case '&':
                  aId[aTermV] = aT.mo[aTermV];
                  break;
               case ':':
                  aT.ml.forEach(function(c) {
                     if (c.Subject === aTermV ||
                         c.Subject === '' && aT.ml[aT.ml.length-1].Subject === aTermV)
                        aId[c.Id] = aT.mo[c.Id];
                  });
                  break;
               case '#':
                  var aTag = sD['/g'].find(function(cG) { return cG.Name === aTermV }).Id;
                  aT.ml.forEach(function(c) {
                     if (c.Tags && c.Tags.includes(aTag))
                        aId[c.Id] = aT.mo[c.Id];
                  });
                  break;
               default:
                  aId[sSvc.cs.Thread] = aT.mo[sSvc.cs.Thread];
               }
            } else {
               aId = sSvc.T[sSvc.cs.Thread][aOp];
            }
            aId = JSON.parse(JSON.stringify(aId));
            break;
         case 'al': case 'cl': case 'ml':
            aData = sSvc.T[sSvc.cs.Thread][aOp];
            break;
         case 'tl':
            if (sSvc.cs.SvcTabs.PosFor === 0) {
               switch (sSvc.cs.SvcTabs.Pos) {
               case 0:
                  aData = sSvc.tl;
                  break;
               case 1:
                  aData = [];
                  sSvc.tl.forEach(function(c) { if (c.Unread) aData.push(c) });
                  break;
               case 2:
                  aData = [];
                  sSvc.tl.forEach(function(c) {
                     if (sSvc.T[c.Id].ml.find(function(cM) { return cM.Tags && cM.Tags.includes('Todo') }))
                        aData.push(c);
                  });
                  break;
               }
            } else {
               var aList = sSvc.cs.SvcTabs.PosFor === 1 ? sSvc.cs.SvcTabs.Pinned : sSvc.cs.SvcTabs.Terms;
               var aTerm = aList[sSvc.cs.SvcTabs.Pos].Term;
               aData = [];
               if (aTerm[0] === '#') {
                  var aTag = sD['/g'].find(function(cG) { return cG.Name === aTerm.slice(1) }).Id;
                  sSvc.tl.forEach(function(c) {
                     if (sSvc.T[c.Id].ml.find(function(cM) { return cM.Tags && cM.Tags.includes(aTag) }))
                        aData.push(c);
                  });
               } else if (aTerm.startsWith('ffn:')) {
                  sSvc.tl.forEach(function(c) {
                     var cT = sSvc.T[c.Id];
                     if (cT.ml.find(fHasFfn))
                        aData.push(c);
                     function fHasFfn(cM) {
                        var cAttach = cT.mo[cM.Id] && cT.mo[cM.Id].SubHead.Attach;
                        return cAttach && cAttach.find(
                           function(cA) { return cA.Name[0] === 'r' && cA.Ffn === aTerm.slice(4, -5) });
                     }
                  });
               } else {
                  aData.push(sSvc.tl[sSvc.tl.length-1]);
               }
            }
            break;
         case 'gl': case 'ot': case 'of': case 'ps': case 'pt': case 'pf':
         case 'cs': case 'cf': case 'cn': case 'fl':
            aData = sSvc[aOp];
            break;
         case 'nlo':
            aData = sD.S[arguments[++a]].nl;
            break;
         case '/t': case '/f': case '/v': case '/g': case '/l':
            aData = sD[aOp];
            if (aOp === '/v' && sNotice)
               mnm.Render('nlo', JSON.stringify(sD.S[sNotice].nl));
            break;
         default:
            throw new Error('_render: unknown op '+ aOp);
         }
         if (aData || aId)
            mnm.Render(aOp, aData && JSON.stringify(aData), aId);
      }
   }

   var sFfn = 'mnmnotmail.net/reg/demo';
   var sSvc = null;
   var sHlist = [], sHpos = -1;
   var sLocalId = 900000000000;
   var sD = {
      '/v': [{"Name":"Blue","NoticeN":1,"UnreadN":1},
             {"Name":"Gold","NoticeN":0,"UnreadN":0}] ,

      '/t': [{"Name":"logo-400-inset-bright.png","Size":70070,"Date":"2019-10-24T21:26:57Z"},
             {"Name":"logo-400-bleed-dim.png","Size":103533,"Date":"2019-10-24T20:57:53Z"},
             {"Name":"BlueFile","Size":26,"Date":"2019-05-29T06:33:20Z"},
             {"Name":"Gold/File","Size":26,"Date":"2019-05-29T06:33:20Z"}] ,

      '/f': [{"Name":"Icecream","Spec":true,"Revs":[
              {"Id":"1","Date":"2019-10-29T22:39:24Z"},
              {"Id":"spec","Date":"2019-10-29T04:35:47Z"}] }] ,

      '/g': [{"Id":"2020-05-06T02:56:08Z","Name":"mnm notes"},
             {"Id":"Todo","Name":"Todo"}] ,

      '/l': {"Addr":"192.168.1.2:8123","Pin":""} ,

      S: {Blue: {
             A:  [["Gold 0528233319", "Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX"]] ,

             cs: {"Sort":{"cl":"Who","al":"Date","t":"Date","f":"Date"},
                  "Thread":"1647c7fe052c8e6d",
                  "ThreadTabs":{"Pos":0,"PosFor":0,"Terms":[],"Type":0},
                  "History":{"Prev":false,"Next":false},
                  "SvcTabs":{"Pos":0,"PosFor":0,"Terms":[],"Pinned":[],"Type":1}} ,

             cf: {"Name":"Blue","HistoryLen":88,"LoginPeriod":0,"Addr":"=192.168.1.3:443",
                  "Verify":false,"Alias":"Blue 0528233319","Uid":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6",
                  "NodeSet":[{"Name":"first","Status":97,"Local":true}]} ,

             cn: {"Addr":"","Pin":"","Xfer":0} ,

             ps: [] ,

             pt: [{"Type":3,"Date":"2020-04-22T04:53:48.395Z",
                   "Text":"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789.",
                   "Alias":"Gold 0528233319","MyAlias":"Blue 0528233319","Response":{}},
                  {"Type":3,"Date":"2019-05-29T06:33:35.309Z",
                   "Alias":"Gold 0528233319","MyAlias":"Blue 0528233319",
                   "Response":{
                    "Type":8,"Date":"2019-05-29T06:33:36.063Z","Alias":"Gold 0528233319",
                    "Uid":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX","MyAlias":"Blue 0528233319",
                    "MsgId":"15a30e173fa0c452","Gid":"Gold-G 0528233319",
                    "Qid":"Gold-G 0528233319_016b024b0fd9","Response":{} }}] ,

             pf: [{"Type":4,"Date":"2020-05-31T17:05:36.284Z",
                   "Text":"test post server filename change",
                   "Alias":"Gold 0528233319","Uid":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                   "MyAlias":"Blue 0528233319","MsgId":"16142b12a75ec3b2","Response":{} },
                  {"Type":8,"Date":"2019-05-29T06:33:36.063Z",
                   "Alias":"Gold 0528233319","Uid":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                   "MyAlias":"Blue 0528233319","MsgId":"15a30e173fa0c452","Gid":"Gold-G 0528233319",
                   "Response":{},"ResponseInvt":{
                    "Type":9,"Date":"2019-05-29T06:33:36.706Z",
                    "Gid":"Gold-G 0528233319","Response":{} }}] ,

             gl: [{"Gid":"Gold-G 0528233319","Date":"2019-05-29T06:33:36.706Z","Admin":false}] ,

             ot: [] ,

             of: [{"Date":"2021-01-24T22:27:48Z","Uid":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                   "Alias":"Gold 0528233319"}] ,

             nl: [{"Type":"i","MsgId":"16142b12a75ec3b2","Date":"2020-05-31T17:08:16Z","Seen":0,"Alias":"Gold 0528233319","Blurb":"test post server filename change"},
                  {"Type":"i","MsgId":"6","Date":"2019-05-28T06:33:29Z","Seen":4,"Alias":"seen"},
                  {"Type":"i","MsgId":"5","Date":"2019-05-28T06:33:29Z","Seen":4,"Alias":"seen"}] ,

             fl: [{"Id":"networkimprov.github.io/mnm-registry/first_recv","Date":"2019-05-29T06:33:28Z"},
                  {"Id":"networkimprov.github.io/mnm-registry/first_sent","Date":"2019-05-29T06:33:23Z"}] ,

             tl: [{"Id":"1647c7fe052c8e6d","Count":2,"Subject":"testing delays","Unread":true,
                   "OrigCc":["Gold 0528233319"],
                   "OrigDate":"2020-11-15T20:25:17.157Z","LastDate":"2020-11-15T20:26:58.960Z",
                   "OrigAuthor":"Blue 0528233319","LastAuthor":"Gold 0528233319"},
                  {"Id":"15a30e173fa0c457","Count":11,"Subject":"reply ohi","SubjectWas":"ohi",
                   "OrigCc":["Blue 0528233319"],
                   "OrigDate":"2019-05-29T06:33:37.006Z","LastDate":"2020-11-15T20:21:33.085Z",
                   "OrigAuthor":"Blue 0528233319","LastAuthor":"Blue 0528233319"},],
             tx: [{"Id":"_016b024c7088","Count":0,"Subject":"abc","OrigCc":[],
                   "OrigDate":"2019-05-29T06:40:00Z","LastDate":"2019-05-29T06:40:00Z",
                   "OrigAuthor":"Blue 0528233319","LastAuthor":""},
                  {"Id":"15a30e173fa0c459","Count":2,"Subject":"to forward","OrigCc":[],
                   "OrigDate":"2019-05-29T06:33:40.076Z","LastDate":"2019-05-29T06:33:41.229Z",
                   "OrigAuthor":"Gold 0528233319","LastAuthor":"Gold 0528233319"}] ,

             T:  {"1647c7fe052c8e6d": {
                  ml: [{"Id":"1647c847245648f6","From":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                        "Alias":"Gold 0528233319","Date":"2020-11-15T20:26:58.960Z",
                        "Subject":"",
                        "Seen":"","Queued":false},
                       {"Id":"1647c847245648f5","From":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                        "Alias":"Gold 0528233319","Date":"2020-11-15T20:26:58.960Z",
                        "Subject":"",
                        "Seen":"2020-11-15T20:27:38Z","Queued":false},
                       {"Id":"1647c7fe052c8e6d","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6",
                        "Alias":"Blue 0528233319","Date":"2020-11-15T20:25:17.157Z",
                        "Subject":"testing delays",
                        "Seen":".","Tags":["Todo"],"Queued":false}] ,

                  mo: {"1647c7fe052c8e6d":
                       {"Id":"1647c7fe052c8e6d","Len":5,"Size":5,
                        "Posted":"2020-11-15T20:25:17.157Z",
                        "From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6",
                        "SubHead":{"Alias":"Blue 0528233319","ThreadId":"1647c7fe052c8e6d",
                                   "Subject":"testing delays"},
                        "msg_data":"boink"},
                       "1647c847245648f5":
                       {"Id":"1647c847245648f5","Len":2,"Size":2,
                        "Posted":"2020-11-15T20:26:58.960Z",
                        "From":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX",
                        "SubHead":{"Alias":"Gold 0528233319","ThreadId":"1647c7fe052c8e6d",
                                   "Subject":""},
                        "msg_data":"ok"}} ,

                  cl: [[],
                       [{"Who":"Blue 0528233319","By":"Blue 0528233319",
                         "WhoUid":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","ByUid":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6",
                         "Date":"2020-11-15T20:25:17.157Z","Note":"author","Subscribe":true,"Queued":false},
                        {"Who":"Gold 0528233319","By":"Blue 0528233319",
                         "WhoUid":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX","ByUid":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6",
                         "Date":"2020-11-15T20:25:17.157Z","Note":"","Subscribe":true,"Queued":false}]] ,

                  al: [] },

                  "15a30e173fa0c457": {
                  ml: [{"Id":"1647c7fe052c8e67","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-11-15T20:21:33.085Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"160a0f4621fc601d","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-29T19:11:27.119Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"160a0f4621fc601c","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-29T19:10:57.529Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"1609e70e45635abe","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-28T06:14:32.078Z","Subject":"reply ohi","Seen":".","Tags":["Todo"],"Queued":false},
                       {"Id":"1609e6cdf061653a","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-28T06:09:48.343Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"1609e61c58e6f761","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-28T05:57:03.943Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"1609e4db0a54ee25","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-28T05:34:17.100Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"1609e42510b0c265","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2020-04-28T05:21:34.931Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"15c7f5aab2710d89","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2019-10-19T22:54:53.408Z","Subject":"reply ohi","Seen":".","Queued":false},
                       {"Id":"15a30e173fa0c458","From":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX","Alias":"Gold 0528233319","Date":"2019-05-29T06:33:39.296Z","Subject":"","Seen":"2019-05-29T06:34:44Z","Queued":false},
                       {"Id":"15a30e173fa0c457","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","Alias":"Blue 0528233319","Date":"2019-05-29T06:33:37.006Z","Subject":"ohi","Seen":".","Queued":false}] ,

                  mo: {"15a30e173fa0c457":{"Id":"15a30e173fa0c457","Len":0,"Posted":"2019-05-29T06:33:37.006Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"ohi","Attach":[{"Name":"u:BlueFile","Size":26},{"Name":"f:Blue.original","Size":402,"Ffn":"networkimprov.github.io/mnm-registry/first"},{"Name":"r:Blue.original","Size":33,"Ffn":"networkimprov.github.io/mnm-registry/first"}]},"msg_data":""},
                       "15a30e173fa0c458":{"Id":"15a30e173fa0c458","Len":0,"Posted":"2019-05-29T06:33:39.296Z","From":"Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX","SubHead":{"Alias":"Gold 0528233319","ThreadId":"15a30e173fa0c457","Subject":"","Attach":[{"Name":"r:Blue.original","Size":33,"Ffn":"networkimprov.github.io/mnm-registry/first"}]},"msg_data":""},
                       "15c7f5aab2710d89":{"Id":"15c7f5aab2710d89","Len":0,"Posted":"2019-10-19T22:54:53.408Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi"},"msg_data":""},
                       "1609e42510b0c265":{"Id":"1609e42510b0c265","Len":13,"Posted":"2020-04-28T05:21:34.931Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi","Attach":[{"Name":"u:mnm-attached.png","Size":15992}]},"msg_data":"sendfile test"},
                       "1609e4db0a54ee25":{"Id":"1609e4db0a54ee25","Len":15,"Posted":"2020-04-28T05:34:17.100Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi","Attach":[{"Name":"u:mnm-attachlist-open.png","Size":8823}]},"msg_data":"sendfile retest"},
                       "1609e61c58e6f761":{"Id":"1609e61c58e6f761","Len":14,"Posted":"2020-04-28T05:57:03.943Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi","Attach":[{"Name":"u:mnm-attachlist.png","Size":8730}]},"msg_data":"sendfile again"},
                       "1609e6cdf061653a":{"Id":"1609e6cdf061653a","Len":8,"Posted":"2020-04-28T06:09:48.343Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi"},"msg_data":"yet more"},
                       "1609e70e45635abe":{"Id":"1609e70e45635abe","Len":13,"Posted":"2020-04-28T06:14:32.078Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi"},"msg_data":"again n again"},
                       "160a0f4621fc601c":{"Id":"160a0f4621fc601c","Len":10,"Posted":"2020-04-29T19:10:57.529Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi"},"msg_data":"1111111112"},
                       "160a0f4621fc601d":{"Id":"160a0f4621fc601d","Len":4,"Posted":"2020-04-29T19:11:27.119Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi"},"msg_data":"1112"},
                       "1647c7fe052c8e67":{"Id":"1647c7fe052c8e67","Len":16,"Size":16,"Posted":"2020-11-15T20:21:33.085Z","From":"5H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6","SubHead":{"Alias":"Blue 0528233319","ThreadId":"15a30e173fa0c457","Subject":"reply ohi"},"msg_data":"try delayed send"}} ,

                  al: [] }
             } },

          Gold: {
             A:  [["Gold 0528233319", "Y5Z%3GSZDVKK1BLPK1DHY4TZ128T18DX"]] ,

             cs: {"Sort":{"cl":"Who","al":"Date","t":"Date","f":"Date"},
                  "Thread":"",
                  "ThreadTabs":{"Pos":0,"PosFor":0,"Terms":[],"Type":0},
                  "History":{"Prev":false,"Next":false},
                  "SvcTabs":{"Pos":0,"PosFor":0,"Terms":[],"Pinned":[],"Type":1}} ,

             cf: {"Name":"Gold","HistoryLen":88,"LoginPeriod":0,"Addr":"=192.168.1.3:443",
                  "Verify":false,"Alias":"Gold 0528233319","Uid":"4H7QC1XG1+LP++6PLW9RPBY3N%CRCFV6",
                  "NodeSet":[{"Name":"first","Status":97,"Local":true}]} ,

             cn: {"Addr":"","Pin":"","Xfer":0} ,

             ps: [] ,
             pt: [] ,
             pf: [] ,
             gl: [] ,
             ot: [] ,
             of: [] ,
             nl: [] ,
             fl: [] ,
             tl: [] ,

             T:  {
             } },
      } };

   if (location.search === '') {
      mnm.demoId = 'local';
   } else {
      mnm.demoId = location.search.slice(1);
      if (!(mnm.demoId in sD.S))
         location.search = ''; // reload page
   }

}).call(this);

