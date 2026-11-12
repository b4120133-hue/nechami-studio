// v2: always ask the server for the newest app page, so updates appear right away
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if (r.mode==='navigate' || (r.method==='GET' && new URL(r.url).origin===location.origin)){
    e.respondWith(fetch(r,{cache:'no-cache'}).catch(()=>fetch(r)));
  }
});
