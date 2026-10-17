"""Local JSON API for later integration into the mobile website."""
import json
from http.server import BaseHTTPRequestHandler,HTTPServer
from rag import ask,config
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass # Do not log questions or identifiers.
 def respond(self,value,status=200):
  b=json.dumps(value,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(b)
 def do_GET(self):
  self.respond({'service':'GramSaathi Aadhaar RAG','endpoint':'POST /ask','fields':{'question':'How do I change my address?','channel':'portal'},'channels':['portal','app','general']})
 def do_POST(self):
  if self.path!='/ask':return self.respond({'error':'Not found'},404)
  if self.headers.get('Origin') not in [None,'http://127.0.0.1:8770','http://localhost:8770']:return self.respond({'error':'Origin not permitted'},403)
  try:
   n=int(self.headers.get('Content-Length','0'))
   if not 0<n<=5000:return self.respond({'error':'Invalid request size'},413)
   data=json.loads(self.rfile.read(n));self.respond(ask(data['question'],data.get('channel','portal')))
  except (ValueError,KeyError,TypeError):self.respond({'error':'Invalid request'},400)
if __name__=='__main__':
 config();print('Local API: http://127.0.0.1:8770');HTTPServer(('127.0.0.1',8770),Handler).serve_forever()
