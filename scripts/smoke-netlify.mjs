import assert from 'node:assert/strict';
const base=process.argv[2];if(!base)throw Error('Provide deployment URL');
for(const path of ['/','/style.css','/app.js','/portal','/portal.js']){const r=await fetch(base+path);assert.equal(r.status,200,path);if(path==='/')assert.match(await r.text(),/GramSaathi/);}
const key=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');
async function call(path,method='GET',body){const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json','X-Case-Token':key,Origin:new URL(base).origin},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,200,JSON.stringify(data));return data;}
const me=await call('/api/me');assert.equal(me.accountLoginAvailable,false);
try{
 const c=await call('/api/case','POST',{});
 await call('/api/case','PATCH',{service:'income',stage:'questions',data:{name:'Deployment Test'}});
 assert.equal((await call('/api/case')).draft.data.name,'Deployment Test');
 await call('/api/login','POST',{code:'246810'});
 const doc=await call('/api/document','POST',{consent:true,name:'fictional-test.txt',type:'text/plain',base64:btoa('FICTIONAL DEPLOYMENT TEST')});
 const payload={service:'income',consent:true,documentId:doc.id,data:{name:'Deployment Test',phone:'9000000000',state:'Maharashtra',district:'Pune',address:'Fictional House, Test Village, Pune',pin:'411001',income:'120000'}};
 const submitted=await call('/api/submit','POST',payload);assert.equal(submitted.application.status,'Submitted');
 assert.equal((await call('/api/submit','POST',payload)).duplicatePrevented,true);
 assert.equal((await call('/api/case')).id,c.id);
 console.log('PASS: homepage, assets, portal, persistence, document upload, manual demo login, submission, duplicate protection.');
}finally{await call('/api/case','DELETE');console.log('Removed fictional test case and document.');}
