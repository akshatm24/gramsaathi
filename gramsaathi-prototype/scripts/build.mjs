import fs from 'node:fs/promises';
const assets={};for(const name of ['index.html','style.css','app.js','portal.html','portal.js'])assets['/'+(name==='index.html'?'':name)]=await fs.readFile('src/'+name,'utf8');
const backend=await fs.readFile('src/backend.js','utf8');
await fs.mkdir('worker',{recursive:true});await fs.writeFile('worker/index.js','const ASSETS='+JSON.stringify(assets)+';\n'+backend);
await fs.rm('dist',{recursive:true,force:true});await fs.mkdir('dist/server',{recursive:true});await fs.mkdir('dist/.openai',{recursive:true});await fs.copyFile('worker/index.js','dist/server/index.js');try { await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json'); } catch (error) { if(error.code!=='ENOENT') throw error; }console.log('Built server and embedded assets');
