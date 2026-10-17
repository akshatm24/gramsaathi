import {getStore} from '@netlify/blobs';
import {guideHandle} from '../lib/guide.mjs';
import {handle} from '../lib/adapter.mjs';
export default async function(request) {
 try {
  const store=getStore({name:'gramsaathi-cases',consistency:'strong'});
  return await guideHandle(request,store) || await handle(request,store);
 } catch {
  return Response.json({error:'Unable to save right now. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
export const config={path:'/api/*'};
