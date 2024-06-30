!function(){"use strict";var e={913:function(){try{self["workbox:core:7.0.0"]&&_()}catch(e){}},977:function(){try{self["workbox:precaching:7.0.0"]&&_()}catch(e){}},80:function(){try{self["workbox:routing:7.0.0"]&&_()}catch(e){}},873:function(){try{self["workbox:strategies:7.0.0"]&&_()}catch(e){}}},t={};function s(a){var r=t[a];if(void 0!==r)return r.exports;var i=t[a]={exports:{}},n=!0;try{e[a](i,i.exports,s),n=!1}finally{n&&delete t[a]}return i.exports}!function(){var e,t;let a,r,i;s(913);let n=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class l extends Error{constructor(e,t){super(n(e,t)),this.name=e,this.details=t}}let c={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},h=e=>[c.prefix,e,c.suffix].filter(e=>e&&e.length>0).join("-"),o=e=>e||h(c.precache),u=e=>e||h(c.runtime);function f(e,t){let s=t();return e.waitUntil(s),s}s(977);class d{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class p{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{let s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}async function g(e,t){let s=null;if(e.url&&(s=new URL(e.url).origin),s!==self.location.origin)throw new l("cross-origin-copy-response",{origin:s});let r=e.clone(),i={headers:new Headers(r.headers),status:r.status,statusText:r.statusText},n=t?t(i):i,c=!function(){if(void 0===a){let e=new Response("");if("body"in e)try{new Response(e.body),a=!0}catch(e){a=!1}a=!1}return a}()?await r.blob():r.body;return new Response(c,n)}let y=e=>new URL(String(e),location.href).href.replace(RegExp(`^${location.origin}`),"");function w(e,t){let s=new URL(e);for(let e of t)s.searchParams.delete(e);return s.href}async function m(e,t,s,a){let r=w(t.url,s);if(t.url===r)return e.match(t,a);let i=Object.assign(Object.assign({},a),{ignoreSearch:!0});for(let n of(await e.keys(t,i)))if(r===w(n.url,s))return e.match(n,a)}class R{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}let C=new Set;async function b(){for(let e of C)await e()}function v(e){return"string"==typeof e?new Request(e):e}s(873);class L{constructor(e,t){for(let s of(this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new R,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,s=v(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){let e=await t.preloadResponse;if(e)return e}let a=this.hasCallback("fetchDidFail")?s.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(e){if(e instanceof Error)throw new l("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let r=s.clone();try{let e;for(let a of(e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await a({event:t,request:r,response:e});return e}catch(e){throw a&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:a.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){let t;let s=v(e),{cacheName:a,matchOptions:r}=this._strategy,i=await this.getCacheKey(s,"read"),n=Object.assign(Object.assign({},r),{cacheName:a});for(let e of(t=await caches.match(i,n),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:a,matchOptions:r,cachedResponse:t,request:i,event:this.event})||void 0;return t}async cachePut(e,t){let s=v(e);await new Promise(e=>setTimeout(e,0));let a=await this.getCacheKey(s,"write");if(!t)throw new l("cache-put-with-no-response",{url:y(a.url)});let r=await this._ensureResponseSafeToCache(t);if(!r)return!1;let{cacheName:i,matchOptions:n}=this._strategy,c=await self.caches.open(i),h=this.hasCallback("cacheDidUpdate"),o=h?await m(c,a.clone(),["__WB_REVISION__"],n):null;try{await c.put(a,h?r.clone():r)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await b(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:i,oldResponse:o,newResponse:r.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){let s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=v(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let s=this._pluginStateMap.get(t),a=a=>{let r=Object.assign(Object.assign({},a),{state:s});return t[e](r)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return!s&&t&&200!==t.status&&(t=void 0),t}}class U{constructor(e={}){this.cacheName=u(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a=new L(this,{event:t,request:s,params:"params"in e?e.params:void 0}),r=this._getResponse(a,s,t),i=this._awaitComplete(r,a,s,t);return[r,i]}async _getResponse(e,t,s){let a;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(!(a=await this._handle(t,e))||"error"===a.type)throw new l("no-response",{url:t.url})}catch(r){if(r instanceof Error){for(let i of e.iterateCallbacks("handlerDidError"))if(a=await i({error:r,event:s,request:t}))break}if(a);else throw r}for(let r of e.iterateCallbacks("handlerWillRespond"))a=await r({event:s,request:t,response:a});return a}async _awaitComplete(e,t,s,a){let r,i;try{r=await e}catch(e){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:r}),await t.doneWaiting()}catch(e){e instanceof Error&&(i=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:r,error:i}),t.destroy(),i)throw i}}class k extends U{constructor(e={}){e.cacheName=o(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(k.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;let a=t.params||{};if(this._fallbackToNetwork){let r=a.integrity,i=e.integrity,n=!i||i===r;s=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?i||r:void 0})),r&&n&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,s.clone()))}else throw new l("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let s=await t.fetch(e);if(!await t.cachePut(e,s.clone()))throw new l("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(let[s,a]of this.plugins.entries())a!==k.copyRedirectedCacheableResponsesPlugin&&(a===k.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(k.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}k.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},k.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await g(e):e};class T{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new k({cacheName:o(e),plugins:[...t,new p({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){let t=[];for(let s of e){"string"==typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);let{cacheKey:e,url:a}=function(e){if(!e)throw new l("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:s}=e;if(!s)throw new l("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}let a=new URL(s,location.href),r=new URL(s,location.href);return a.searchParams.set("__WB_REVISION__",t),{cacheKey:a.href,url:r.href}}(s),r="string"!=typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==e)throw new l("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:e});if("string"!=typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new l("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(e,s.integrity)}this._urlsToCacheKeys.set(a,e),this._urlsToCacheModes.set(a,r),t.length>0&&console.warn(`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`)}}install(e){return f(e,async()=>{let t=new d;for(let[s,a]of(this.strategy.plugins.push(t),this._urlsToCacheKeys)){let t=this._cacheKeysToIntegrities.get(a),r=this._urlsToCacheModes.get(s),i=new Request(s,{integrity:t,cache:r,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:a},request:i,event:e}))}let{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}})}activate(e){return f(e,async()=>{let e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(let r of t)s.has(r.url)||(await e.delete(r),a.push(r.url));return{deletedURLs:a}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){let t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(e){let t=this.getCacheKeyForURL(e);if(!t)throw new l("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let K=()=>(r||(r=new T),r);s(80);let q=e=>e&&"object"==typeof e?e:{handle:e};class x{constructor(e,t,s="GET"){this.handler=q(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=q(e)}}class P extends x{constructor(e,t,s){super(({url:t})=>{let s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}class E{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{let{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){let{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(t=>{"string"==typeof t&&(t=[t]);let s=new Request(...t);return this.handleRequest({request:s,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){let s;let a=new URL(e.url,location.href);if(!a.protocol.startsWith("http"))return;let r=a.origin===location.origin,{params:i,route:n}=this.findMatchingRoute({event:t,request:e,sameOrigin:r,url:a}),l=n&&n.handler,c=e.method;if(!l&&this._defaultHandlerMap.has(c)&&(l=this._defaultHandlerMap.get(c)),!l)return;try{s=l.handle({url:a,request:e,event:t,params:i})}catch(e){s=Promise.reject(e)}let h=n&&n.catchHandler;return s instanceof Promise&&(this._catchHandler||h)&&(s=s.catch(async s=>{if(h)try{return await h.handle({url:a,request:e,event:t,params:i})}catch(e){e instanceof Error&&(s=e)}if(this._catchHandler)return this._catchHandler.handle({url:a,request:e,event:t});throw s})),s}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){for(let r of this._routes.get(s.method)||[]){let i;let n=r.match({url:e,sameOrigin:t,request:s,event:a});if(n)return Array.isArray(i=n)&&0===i.length?i=void 0:n.constructor===Object&&0===Object.keys(n).length?i=void 0:"boolean"==typeof n&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,q(e))}setCatchHandler(e){this._catchHandler=q(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new l("unregister-route-but-not-found-with-method",{method:e.method});let t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new l("unregister-route-route-not-registered")}}let N=()=>(i||((i=new E).addFetchListener(),i.addCacheListener()),i);class M extends x{constructor(e,t){super(({request:s})=>{let a=e.getURLsToCacheKeys();for(let r of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:r}={}){let i=new URL(e,location.href);i.hash="",yield i.href;let n=function(e,t=[]){for(let s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(i,t);if(yield n.href,s&&n.pathname.endsWith("/")){let e=new URL(n.href);e.pathname+=s,yield e.href}if(a){let e=new URL(n.href);e.pathname+=".html",yield e.href}if(r)for(let e of r({url:i}))yield e.href}(s.url,t)){let t=a.get(r);if(t){let s=e.getIntegrityForCacheKey(t);return{cacheKey:t,integrity:s}}}},e.strategy)}}e=[{'revision':'4c11c99fe8092d554b441325d22d2545','url':'/_next/static/b8kcxc2VtCESzD29nNNhB/_buildManifest.js'},{'revision':'b6652df95db52feb4daf4eca35380933','url':'/_next/static/b8kcxc2VtCESzD29nNNhB/_ssgManifest.js'},{'revision':'6e9052a75d601986','url':'/_next/static/chunks/957-6e9052a75d601986.js'},{'revision':'ecc4130bc7a58a64','url':'/_next/static/chunks/framework-ecc4130bc7a58a64.js'},{'revision':'80f487b6751758a0','url':'/_next/static/chunks/main-80f487b6751758a0.js'},{'revision':'2ec87489424f96ca','url':'/_next/static/chunks/pages/404-2ec87489424f96ca.js'},{'revision':'c3a77ea915ffa2e3','url':'/_next/static/chunks/pages/_app-c3a77ea915ffa2e3.js'},{'revision':'77823ddac6993d35','url':'/_next/static/chunks/pages/_error-77823ddac6993d35.js'},{'revision':'c51bccfaf515fcb9','url':'/_next/static/chunks/pages/index-c51bccfaf515fcb9.js'},{'revision':'79330112775102f91e1010318bae2bd3','url':'/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js'},{'revision':'6ef43a8d4a395f49','url':'/_next/static/chunks/webpack-6ef43a8d4a395f49.js'},{'revision':'7426dd01ba41b923','url':'/_next/static/css/7426dd01ba41b923.css'},{'revision':'4839d135fc93d344ad5c1a9aac1691f3','url':'/favicon.ico'},{'revision':'54225e9eaf0d29c7ccfb485468329402','url':'/icon-192x192.png'},{'revision':'38bbfb6fa4cceeeba9b1f8e738d16565','url':'/icon-256x256.png'},{'revision':'820a97617ae25ca5d15a2b3125895a88','url':'/icon-384x384.png'},{'revision':'bb14dc2837c5d5b0c851ab35d38d1fb8','url':'/icon-512x512.png'},{'revision':'fb9742f731fce6301d109ca54727cd33','url':'/manifest.json'},{'revision':'8b73c1b7d7fab7081f1eda4ace5ec9ee','url':'/refine_logo.png'},{'revision':'10598c2089399dbb44405eb24e862865','url':'/service-worker.js'},{'revision':'b30da29fdf74343d8fc94c8b79cfea2a','url':'/sw.js'}],K().precache(e),t=void 0,function(e,t,s){let a;if("string"==typeof e){let t=new URL(e,location.href);a=new x(({url:e})=>e.href===t.href,void 0,void 0)}else if(e instanceof RegExp)a=new P(e,void 0,void 0);else if("function"==typeof e)a=new x(e,void 0,void 0);else if(e instanceof x)a=e;else throw new l("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});N().registerRoute(a)}(new M(K(),t)),self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})}()}();