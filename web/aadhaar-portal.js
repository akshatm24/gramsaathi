const names=['name','address','city','state','pin','documentType'];let logged=false;
const fields=document.getElementById('fields');for(const name of names){const label=document.createElement('label');label.className='field';label.textContent=name;const input=document.createElement('input');input.name=name;input.readOnly=true;label.append(input);fields.append(label);}
document.getElementById('login').onsubmit=e=>{e.preventDefault();parent.postMessage({type:'gs-login',code:document.getElementById('code').value},location.origin);};
window.addEventListener('message',async e=>{if(e.origin!==location.origin||e.source!==parent)return;
 if(e.data?.type==='gs-login-ok'){logged=true;document.getElementById('login').hidden=true;document.getElementById('form').hidden=false;}
 if(e.data?.type==='gs-fill'&&logged){document.getElementById('status').textContent='Copying your approved details…';for(const name of names){document.querySelector(`[name="${name}"]`).value=e.data.data[name]||'';await new Promise(r=>setTimeout(r,180));}
 document.getElementById('doc').textContent='Attached: '+e.data.document.name;
 const binary=atob(e.data.document.content);const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));const file=new File([bytes],e.data.document.name,{type:e.data.document.type});
 // Keep the received file as a real attachment in this controlled portal.
 const attachment=document.createElement('input');attachment.type='file';attachment.id='attachment';attachment.setAttribute('aria-label','Attached sample document');const transfer=new DataTransfer();transfer.items.add(file);attachment.files=transfer.files;attachment.disabled=true;document.getElementById('doc').append(attachment);window.practiceAttachment=file;
 const data=Object.fromEntries(names.map(n=>[n,document.querySelector(`[name="${n}"]`).value]));document.getElementById('status').textContent='Filled. Checking the fields before your review…';await new Promise(r=>setTimeout(r,500));parent.postMessage({type:'gs-filled',data,documentId:e.data.document.id},location.origin);
 }});
