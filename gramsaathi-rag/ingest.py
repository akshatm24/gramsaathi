"""Bounded official-source crawl. Run from this directory; inspect manifest before release."""
import hashlib,io,json,sqlite3,time,urllib.robotparser
from pathlib import Path
from urllib.parse import urljoin,urlsplit
from datetime import datetime,timezone
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
SEEDS=[('https://uidai.gov.in/en/enrolment-and-update','general'),('https://uidai.gov.in/en/aadhaar-online-services','portal'),('https://uidai.gov.in/en/aadhaar-app-faq','app'),('https://uidai.gov.in/en/enrolment-and-updates?isFilter=false&source=documents&sourceTitle=Documents','documents')]
ALLOWED={'uidai.gov.in','www.uidai.gov.in','backend.uidai.gov.in'}
ROOT=Path(__file__).parent; DATA=ROOT/'data'; RAW=DATA/'raw'
def allowed(u):return urlsplit(u).scheme=='https' and urlsplit(u).hostname in ALLOWED

def build():
 RAW.mkdir(parents=True,exist_ok=True); session=requests.Session();session.headers['User-Agent']='GramSaathiResearch/0.1 (student public guidance archive)'
 db=sqlite3.connect(DATA/'knowledge.next.sqlite');db.executescript('DROP TABLE IF EXISTS chunks; CREATE VIRTUAL TABLE chunks USING fts5(id UNINDEXED,title,text,url UNINDEXED,channel UNINDEXED,fetched UNINDEXED,page UNINDEXED);')
 records=[];queue=list(SEEDS);seen=set();robots={};count=0
 while queue and len(seen)<24:
  url,channel=queue.pop(0)
  if url in seen or not allowed(url):continue
  seen.add(url); rec={'url':url,'channel':channel,'fetched':datetime.now(timezone.utc).isoformat(),'publisher':'UIDAI'}
  try:
   host=urlsplit(url).netloc
   if host not in robots:
    rr=session.get('https://'+host+'/robots.txt',timeout=25);rp=urllib.robotparser.RobotFileParser();rp.parse(rr.text.splitlines() if rr.status_code==200 else ['User-agent: *','Allow: /'] if rr.status_code==404 else ['User-agent: *','Disallow: /']);robots[host]=rp
   if not robots[host].can_fetch('GramSaathiResearch',url):raise ValueError('robots.txt disallows crawling')
   time.sleep(.7);r=session.get(url,timeout=40,allow_redirects=False)
   if r.is_redirect:
    dest=urljoin(url,r.headers['Location'])
    if allowed(dest):queue.append((dest,channel))
    raise ValueError('Redirect recorded; allowed destination queued')
   r.raise_for_status();b=r.content
   if len(b)>25_000_000:raise ValueError('Document exceeds 25 MB limit')
   digest=hashlib.sha256(b).hexdigest();pdf=b.startswith(b'%PDF');fn=digest+('.pdf' if pdf else '.html');(RAW/fn).write_bytes(b)
   rec.update(sha256=digest,file='raw/'+fn,last_modified=r.headers.get('Last-Modified'),status='indexed')
   pieces=[]
   if pdf:
    reader=PdfReader(io.BytesIO(b));rec['title']=urlsplit(url).path.split('/')[-1]
    for i,p in enumerate(reader.pages):
     text=' '.join((p.extract_text() or '').split())
     # PDF tables need manual review; archive them but do not use them for answers.
     if text:pieces.append((rec['title'],text,i+1))
    rec['status']='archived_pending_review';rec['pages']=len(reader.pages);pieces=[]
   else:
    soup=BeautifulSoup(b,'html.parser');main=soup.find('main') or soup;rec['title']=(soup.title.get_text(' ',strip=True) if soup.title else url)
    for p in main.select('p[id]'):
     answer=p.find_next_sibling('div')
     if answer:
      q=p.get_text(' ',strip=True);a=answer.get_text(' ',strip=True)
      if len(q)>8 and len(a)>15:pieces.append((q,q+'\n'+a,None))
    if not pieces:rec['status']='archived_no_faq_chunks'
    for a in main.select('a[href]'):
     link=urljoin(url,a['href']).split('#')[0]
     if allowed(link) and '.pdf' in urlsplit(link).path.lower() and any(k in (a.get_text(' ',strip=True)+' '+link).lower() for k in ['document','regulation','handbook','charge','update','form']):queue.append((link,'reference'))
   for i,(title,text,page) in enumerate(pieces):
    # Keep a complete question and answer together; avoid fragmentary evidence.
    if len(text)>18000:continue
    ident=digest[:12]+'-'+str(i);db.execute('INSERT INTO chunks VALUES(?,?,?,?,?,?,?)',(ident,title,text,url,channel,rec['fetched'],page));count+=1
   rec['chunks']=len(pieces)
  except Exception as e:rec.update(status='failed',error=type(e).__name__+': '+str(e)[:180])
  records.append(rec);print(rec['status'],url,rec.get('error',''),flush=True)
 db.commit();db.close()
 (DATA/'crawl-report.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 if count==0:raise RuntimeError('No usable guidance extracted; existing database preserved')
 (DATA/'knowledge.next.sqlite').replace(DATA/'knowledge.sqlite');(DATA/'manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2));print('Indexed',count,'FAQ passages; sources',len(records))
if __name__=='__main__':build()
