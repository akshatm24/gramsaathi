import backend from '../../gramsaathi-prototype/src/backend.js';
export function bucketAdapter(store) {
 return {
  async get(key) {
   const text=await store.get(key,{type:'text'});
   return text===null?null:{json:async()=>JSON.parse(text)};
  },
  async put(key,value,options) {
   await store.set(key,value instanceof Uint8Array?value.buffer.slice(value.byteOffset,value.byteOffset+value.byteLength):value,
    {metadata:{contentType:options?.httpMetadata?.contentType||'application/json'}});
  },
  async delete(key) { await store.delete(key); }
 };
}
export async function handle(request,store) {
 const path=new URL(request.url).pathname;
 if(path==='/api/me'&&request.method==='GET') return Response.json({signedIn:false,hasCase:false,provider:'device',accountLoginAvailable:false},{headers:{'Cache-Control':'no-store'}});
 // Sites identity headers are client-controlled on Netlify. Never trust them here.
 const headers=new Headers(request.headers);
 for(const key of [...headers.keys()]) if(key.startsWith('oai-')) headers.delete(key);
 return backend.fetch(new Request(request,{headers}),{BUCKET:bucketAdapter(store)});
}
