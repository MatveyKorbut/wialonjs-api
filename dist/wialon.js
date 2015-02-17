/*
 Wialon 0.0.1 (39981ca), a JS library for Wialon
 (c) 2015 Aleksey Shmigelski
*/
!function(window){function expose(){var t=window.W;W.noConflict=function(){return window.W=t,this},window.W=W}var W={version:"0.0.1"};"object"==typeof module&&"object"==typeof module.exports?module.exports=W:"function"==typeof define&&define.amd&&define(W),"undefined"!=typeof window&&expose(),W.Util={extend:function(t){var e,i,n,s;for(i=1,n=arguments.length;n>i;i++){s=arguments[i];for(e in s)t[e]=s[e]}return t},create:Object.create||function(){function t(){}return function(e){return t.prototype=e,new t}}(),bind:function(t,e){var i=Array.prototype.slice;if(t.bind)return t.bind.apply(t,i.call(arguments,1));var n=i.call(arguments,2);return function(){return t.apply(e,n.length?n.concat(i.call(arguments)):arguments)}},stamp:function(t){return t._id=t._id||++W.Util.lastId,t._id},lastId:0,falseFn:function(){return!1},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return W.Util.trim(t).split(/\s+/)},setOptions:function(t,e){t.hasOwnProperty("options")||(t.options=t.options?W.Util.create(t.options):{});for(var i in e)t.options[i]=e[i];return t.options},getParamString:function(t,e,i){var n=[];for(var s in t)n.push(encodeURIComponent(i?s.toUpperCase():s)+"="+encodeURIComponent(t[s]));return(e&&-1!==e.indexOf("?")?"&":"?")+n.join("&")},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},W.extend=W.Util.extend,W.stamp=W.Util.stamp,W.bind=W.Util.bind,W.setOptions=W.Util.setOptions,W.Class=function(){},W.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},i=e.__super__=this.prototype,n=W.Util.create(i);n.constructor=e,e.prototype=n;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);return t.statics&&(W.extend(e,t.statics),delete t.statics),t.includes&&(W.Util.extend.apply(null,[n].concat(t.includes)),delete t.includes),n.options&&(t.options=W.Util.extend(W.Util.create(n.options),t.options)),W.extend(n,t),n._initHooks=[],n.callInitHooks=function(){if(!this._initHooksCalled){i.callInitHooks&&i.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=n._initHooks.length;e>t;t++)n._initHooks[t].call(this)}},e},W.Class.include=function(t){W.extend(this.prototype,t)},W.Class.mergeOptions=function(t){W.extend(this.prototype.options,t)},W.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i)},W.Evented=W.Class.extend({on:function(t,e,i){if("object"==typeof t)for(var n in t)this._on(n,t[n],e);else{t=W.Util.splitWords(t);for(var s=0,o=t.length;o>s;s++)this._on(t[s],e,i)}return this},off:function(t,e,i){if(t)if("object"==typeof t)for(var n in t)this._off(n,t[n],e);else{t=W.Util.splitWords(t);for(var s=0,o=t.length;o>s;s++)this._off(t[s],e,i)}else delete this._events;return this},_on:function(t,e,i){var n=this._events=this._events||{},s=i&&i!==this&&W.stamp(i);if(s){var o=t+"_idx",r=t+"_len",a=n[o]=n[o]||{},l=W.stamp(e)+"_"+s;a[l]||(a[l]={fn:e,ctx:i},n[r]=(n[r]||0)+1)}else n[t]=n[t]||[],n[t].push({fn:e})},_off:function(t,e,i){var n=this._events,s=t+"_idx",o=t+"_len";if(n){if(!e)return delete n[t],delete n[s],void delete n[o];var r,a,l,c,d,u=i&&i!==this&&W.stamp(i);if(u)d=W.stamp(e)+"_"+u,r=n[s],r&&r[d]&&(c=r[d],delete r[d],n[o]--);else if(r=n[t])for(a=0,l=r.length;l>a;a++)if(r[a].fn===e){c=r[a],r.splice(a,1);break}c&&(c.fn=W.Util.falseFn)}},fire:function(t,e,i){if(!this.listens(t,i))return this;var n=W.Util.extend({},e,{type:t,target:this}),s=this._events;if(s){var o,r,a,l,c=s[t+"_idx"];if(s[t])for(a=s[t].slice(),o=0,r=a.length;r>o;o++)a[o].fn.call(this,n);for(l in c)c[l].fn.call(c[l].ctx,n)}return i&&this._propagateEvent(n),this},listens:function(t,e){var i=this._events;if(i&&(i[t]||i[t+"_len"]))return!0;if(e)for(var n in this._eventParents)if(this._eventParents[n].listens(t,e))return!0;return!1},once:function(t,e,i){if("object"==typeof t){for(var n in t)this.once(n,t[n],e);return this}var s=W.bind(function(){this.off(t,e,i).off(t,s,i)},this);return this.on(t,e,i).on(t,s,i)},addEventParent:function(t){return this._eventParents=this._eventParents||{},this._eventParents[W.stamp(t)]=t,this},removeEventParent:function(t){return this._eventParents&&delete this._eventParents[W.stamp(t)],this},_propagateEvent:function(t){for(var e in this._eventParents)this._eventParents[e].fire(t.type,W.extend({layer:t.target},t),!0)}});var proto=W.Evented.prototype;proto.addEventListener=proto.on,proto.removeEventListener=proto.clearAllEventListeners=proto.off,proto.addOneTimeEventListener=proto.once,proto.fireEvent=proto.fire,proto.hasEventListeners=proto.listens,W.Mixin={Events:proto},W.Request=W.Class.extend({options:{},_id:0,_url:"",_io:null,_counter:0,_requests:[],_callbacks:[],_frameReady:!1,initialize:function(t,e){e=W.setOptions(this,e),this._url=this._createFullUrl(t)+"/wialon/post.html",this._id=this._url,this._io=document.createElement("iframe"),this._io.style.display="none",this._io.setAttribute("src",this._url),this._io.addEventListener("load",this._frameLoaded.bind(this),!1),window.addEventListener("message",this._receiveMessage.bind(this),!1),document.body.appendChild(this._io)},send:function(t,e,i,n){var s={id:++this._counter,url:t,params:this._urlEncodeData(e),source:this._id},o=this._io.contentWindow;if(o){var r=JSON.stringify(s);this._callbacks[this._counter]=[i,n,r,0],this._frameReady?o.postMessage(r,this._url):this._requests.push(r)}},_createFullUrl:function(t){if(!t){var e=document.location;t=e.protocol+"//"+e.hostname+(e.port.length?":"+e.port:"")}return t},_receiveMessage:function(){var data={error:-1};try{data=JSON.parse(event.data)}catch(e){try{data=eval("("+event.data+")")}catch(e){console.warn("Invalid JSON")}}if(data.source==this._id)if(data.id){var callback=this._callbacks[data.id];if(callback){if(data&&data.text&&data.text.error&&1003==data.text.error&&callback[3]<3&&(callback[3]++,callback[4]&&callback[5]&&(clearTimeout(callback[5]),callback[5]=setTimeout(W.bind(this._timeout,this,this._counter),1e3*callback[4])),this._io.contentWindow))return void setTimeout(W.bind(function(t){this._io.contentWindow.postMessage(t,this._url)},this,callback[2]),1e3*Math.random());callback[data.error]&&callback[data.error](data.text),callback[4]&&callback[5]&&clearTimeout(callback[5]),delete this._callbacks[data.id]}}else this._frameReady=!0,this._frameLoaded()},_frameLoaded:function(){if(this._frameReady)for(;this._requests.length;)this._io.contentWindow.postMessage(this._requests.pop(),this._url);else this._io.contentWindow.postMessage("{id: 0, source:'"+this._id+"'}",this._url)},_timeout:function(t){var e=this._callbacks[t];e&&(e[1]&&e[1](),delete this._callbacks[t])},_urlEncodeData:function(t){var e=[],i=!1;if("object"==typeof t){for(var n in t)e.push("object"==typeof t[n]?n+"="+encodeURIComponent(JSON.stringify(t[n])):n+"="+encodeURIComponent(t[n])),"sid"==n&&(i=!0);return e.join("&")+(i?"&sid="+i:"")}return i?"&sid="+i:""}}),W.request=function(t,e){return new W.Request(t,e)},W.Session=W.Evented.extend({options:{eventsTimeout:10},_sid:null,_request:null,_serverTime:0,_eventsInterval:0,_classes:{},_items:{},initialize:function(t,e){e=W.setOptions(this,e),this._request=new W.Request(t)},login:function(t,e,i,n){if(!this._sid){var s={user:t,password:e,operateAs:i||""};this._request.send("/wialon/ajax.html?svc=core/login",{params:s},this._loginCallback.bind(this,n),this._loginCallback.bind(this,n))}},_loginCallback:function(t,e){e.error?console.warn("Login error"):(this._sid=e.eid,this._serverTime=e.tm,this._classes=e._classes,this.options.eventsTimeout&&(this._eventsInterval=setInterval(this.getEvents.bind(this),1e3*this.options.eventsTimeout))),t&&t(e)},getEvents:function(){null!==this._sid&&this._request.send("/avl_evts",{sid:this._sid},this._getEventsCallback,this._getEventsCallback)},_getEventsCallback:function(t){this._serverTime=t.tm,t.events.length>0},updateDataFlags:function(t,e){if(this._sid){var i={spec:t};this._request.send("/wialon/ajax.html?svc=core/update_data_flags",{params:i,sid:this._sid},this._updateDataFlagsCallback.bind(this,e),this._updateDataFlagsCallback.bind(this,e))}},_updateDataFlagsCallback:function(t,e){for(var i=0;i<e.length;i++)e[i].d?this._items[e[i].i]=e[i].d:e[i].i in this._items&&(this._items[e[i].i]=null,delete this._items[e[i].i]);t&&t(e)}}),W.session=function(t,e){return new W.Session(t,e)}}(window);