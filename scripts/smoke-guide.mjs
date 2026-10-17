import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
const origin=process.argv[2];if(!origin)throw Error('Pass a deployment URL');
const token=randomBytes(32).toString('hex');
async function api(path,body,method=body?'POST':'GET'){const r=await fetch(origin+'/api/'+path,{method,headers:{'Content-Type':'application/json','X-Case-Token':token},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,200,JSON.stringify(data));return data;}
for(const path of ['/','/guide.css','/guide.js','/aadhaar-portal.html','/aadhaar-portal.js','/workflow.html'])assert.equal((await fetch(origin+path)).status,200,path);
try{
 const a=await api('guide',{question:'How can I update my Aadhaar address online?',channel:'portal'});assert.equal(a.status,'supported',JSON.stringify(a));assert.ok(a.citations.length);console.log('Live Gemini returned verified official passages.');
 await api('journey/start',{consent:true});
 const data={name:'Smoke Test Citizen',address:'12 Example Road',city:'Example Village',state:'Uttar Pradesh',pin:'208016',documentType:'Sample address proof'};
 await api('journey/details',{data});let c=await api('journey/document',{consent:true,name:'sample.txt',type:'text/plain',content:Buffer.from('Fictional test document').toString('base64')});
 await api('journey/login',{code:'246810'});c=await api('journey/review',{data,documentId:c.documents[0].id});c=await api('journey/submit',{consent:true,reviewId:c.review.id});assert.equal(c.stage,'complete');
 const resumed=await api('journey');assert.equal(resumed.receipt.reference,c.receipt.reference);console.log('Complete application pipeline and saved progress passed.');
 const unsupported=await api('guide',{question:'What fee do I pay?',channel:'portal'});assert.equal(unsupported.status,'insufficient');console.log('Unsupported fees withheld.');
}finally{await api('journey',null,'DELETE');console.log('Fictional smoke-test case deleted.');}
