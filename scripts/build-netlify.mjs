import fs from 'node:fs/promises';
await fs.rm('dist',{recursive:true,force:true});
await fs.mkdir('dist',{recursive:true});
for(const name of ['index.html','style.css','app.js','portal.html','portal.js']) {
 await fs.copyFile('gramsaathi-prototype/src/'+name,'dist/'+name);
}
console.log('Built Netlify public assets (backend and private data excluded).');
