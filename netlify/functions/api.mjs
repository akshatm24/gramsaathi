import {getStore} from '@netlify/blobs';
import {handle} from '../lib/adapter.mjs';
export default async function(request) {
 try {
  return await handle(request,getStore({name:'gramsaathi-cases',consistency:'strong'}));
 } catch {
  return Response.json({error:'Unable to save right now. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
export const config={path:'/api/*'};
