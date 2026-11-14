// customers app: newest page from the server, saved copy if offline or slow (6s)
const C='nechami-kupa-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('nechami-kupa-')&&k!==C)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const url=new URL(r.url);if(url.origin!==location.origin||!url.pathname.includes('/kupa/'))return;
  e.respondWith((async()=>{
    const cache=await caches.open(C),key=r.mode==='navigate'?new URL('./',location).href:r.url;
    const net=fetch(r.url,{cache:'no-cache'}).then(res=>{if(res&&res.ok)cache.put(key,res.clone()).catch(()=>{});return res});
    const old=await cache.match(key);
    if(!old)return net.catch(()=>fetch(r));
    const t=new Promise(res=>setTimeout(()=>res(old),6000));
    return Promise.race([net.catch(()=>old),t]);
  })());
});
