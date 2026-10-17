import test from 'node:test';
import assert from 'node:assert/strict';
import {handle} from '../netlify/lib/adapter.mjs';
const store=()=>{const m=new Map();return {get:async k=>m.get(k)??null,set:async(k,v)=>m.set(k,v),delete:async k=>m.delete(k)}};
const token='a'.repeat(64);
const request=(path,method='GET',body,extra={})=>new Request('https://example.netlify.app'+path,{method,headers:{'Content-Type':'application/json','X-Case-Token':token,...extra},...(body?{body:JSON.stringify(body)}:{})});
test('Netlify persists drafts across requests and deletes cases',async()=>{
 const s=store();assert.equal((await handle(request('/api/case','POST',{}),s)).status,200);
 await handle(request('/api/case','PATCH',{service:'income',stage:'questions',data:{name:'Sample Citizen'}}),s);
 const c=await (await handle(request('/api/case'),s)).json();assert.equal(c.draft.data.name,'Sample Citizen');
 assert.equal((await handle(request('/api/case','DELETE'),s)).status,200);
 assert.equal((await handle(request('/api/case'),s)).status,404);
});
test('Netlify rejects forged Sites identity and does not advertise unsupported login',async()=>{
 const s=store();const me=await (await handle(request('/api/me','GET',null,{'oai-authenticated-user-id':'fake','oai-authenticated-user-email':'fake@example.com'}),s)).json();
 assert.equal(me.signedIn,false);assert.equal(me.accountLoginAvailable,false);
 const r=await handle(new Request('https://example.netlify.app/api/case',{method:'POST',headers:{'oai-authenticated-user-id':'fake','oai-authenticated-user-email':'fake@example.com'},body:'{}'}),s);assert.equal(r.status,401);
 assert.equal((await handle(request('/api/case','POST',{}, {Origin:'https://evil.example'}),s)).status,403);
});
