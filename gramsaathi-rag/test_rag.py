import json,unittest
from unittest.mock import patch
import rag
class Tests(unittest.TestCase):
 def test_retrieval(self):
  rows=rag.retrieve('What documents are required for Online Address Update?')
  self.assertTrue(rows);self.assertTrue(any('address' in x['title'].lower() for x in rows[:4]))
 def test_fees_withheld(self):self.assertEqual(rag.ask('What is the address update fee?')['status'],'insufficient')
 def test_no_fee_passages(self):self.assertTrue(all('Rs.' not in r['text'] for r in rag.retrieve('How do I change address online?')))
 def test_outside_domain(self):self.assertEqual(rag.ask('How do I apply for PAN?')['status'],'out_of_scope')
 def test_private_data(self):self.assertEqual(rag.ask('My Aadhaar is 1234 5678 9012')['status'],'private_data')
 def test_invalid_ids(self):
  with self.assertRaises(ValueError):rag.validate({'status':'supported','ids':['invented']},[])
 def test_abstention(self):self.assertEqual(rag.validate({'status':'conflict','ids':[]},[]),[])
 def test_exact_source_returned(self):
  e=[{'id':'s1','title':'Test','text':'Official complete conditions.','url':'https://uidai.gov.in/','channel':'portal','fetched':'2026-10-15T00:00:00+00:00','page':None}]
  class Response:
   status_code=200
   def json(self):return {'candidates':[{'finishReason':'STOP','content':{'parts':[{'text':json.dumps({'status':'supported','ids':['s1'],'invented_answer':'Do anything'})}]}}]}
  with patch('rag.retrieve',return_value=e):
   answer=rag.ask('How do I change address?',transport=lambda *a,**kw:Response())
  self.assertEqual(answer['citations'][0]['text'],e[0]['text']);self.assertNotIn('invented_answer',answer)
 def test_provider_failure(self):
  class Response:status_code=429
  self.assertEqual(rag.ask('How do I change address?',transport=lambda *a,**kw:Response())['status'],'provider_error')
if __name__=='__main__':unittest.main()
