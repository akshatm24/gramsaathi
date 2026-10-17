"""Refresh the reviewed UIDAI online-update section without promoting unreviewed PDF text."""
import urllib.request,json,hashlib,datetime,re
from html.parser import HTMLParser
from pathlib import Path
url='https://uidai.gov.in/en/updating-data-on-aadhaar'
raw=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'GramSaathi-Research/1.0'}),timeout=30).read()
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,s):self.parts.append(s)
p=Text();p.feed(raw.decode());text=re.sub(r'\s+',' ',' '.join(p.parts))
start=text.index('The online mode offers address update')
end=text.index('By Visiting',start)
section=text[start:end].strip()
assert 'registered mobile number' in section and 'supporting POA' in section and len(section)<2000
root=Path(__file__).resolve().parents[1]
archive=root/'gramsaathi-rag/data/raw/online-update-process.html';archive.write_bytes(raw)
record={'id':'online-update-reviewed-20261017','title':'Online Aadhaar address update: login, OTP and supporting documents','text':section,'url':url,'channel':'portal','fetched':datetime.datetime.now(datetime.timezone.utc).isoformat(),'page':None,'sha256':hashlib.sha256(raw).hexdigest()}
path=root/'netlify/lib/knowledge.json';rows=json.loads(path.read_text());rows=[r for r in rows if r['id']!=record['id']];rows.append(record);path.write_text(json.dumps(rows,ensure_ascii=False))
print('Verified and archived online-update section:',len(section),'characters;',len(rows),'passages')
