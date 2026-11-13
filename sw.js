// v3: newest app page from the server, but never hang: after 6 seconds use the last saved copy
const C='nechami-app-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{ for (const k of await caches.keys()) if (k!==C) await caches.delete(k); await self.clients.claim(); })()));
self.addEventListener('fetch',e=>{
  const r=e.request; if (r.method!=='GET') return;
  const url=new URL(r.url); if (url.origin!==location.origin) return;
  e.respondWith((async()=>{
    const cache=await caches.open(C), key=r.mode==='navigate'?new URL('./',location).href:r.url;
    const net=fetch(r.url,{cache:'no-cache'}).then(res=>{ if (res&&res.ok) cache.put(key,res.clone()).catch(()=>{}); return res; });
    const old=await cache.match(key);
    if (!old) return net.catch(()=>fetch(r));
    const timeout=new Promise(res=>setTimeout(()=>res(old),6000));
    return Promise.race([net.catch(()=>old),timeout]);
  })());
});
