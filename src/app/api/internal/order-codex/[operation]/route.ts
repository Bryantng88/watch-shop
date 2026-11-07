import {NextRequest,NextResponse} from 'next/server';
import {authenticateCodexWorker} from '@/domains/personal-work/server/codex/codex-config';
import {orderCodexReady,claimOrderWorkflow,heartbeatOrderWorkflow,finishOrderWorkflow} from '@/domains/order/codex/workflow.service';
import {z} from 'zod';
export async function POST(req:NextRequest,ctx:{params:Promise<{operation:string}>}){
 if(!orderCodexReady())return NextResponse.json({error:'Unavailable'},{status:503});
 if(!authenticateCodexWorker(req.headers.get('authorization')))return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const text=await req.text();if(text.length>64000)return NextResponse.json({error:'Too large'},{status:413});const b=JSON.parse(text);const op=(await ctx.params).operation;
 if(op==='claim'){const v=z.object({workerId:z.string().regex(/^[\w.-]{1,80}$/)}).parse(b);return NextResponse.json({run:await claimOrderWorkflow(v.workerId)});}
 const v=z.object({id:z.string().uuid(),leaseToken:z.string().uuid()}).parse(b);
 if(op==='heartbeat'){const active=await heartbeatOrderWorkflow(v.id,v.leaseToken);return NextResponse.json({active},{status:active?200:409});}
 if(op==='finish'){const accepted=await finishOrderWorkflow(v.id,v.leaseToken,b.plan,b.failed===true);return NextResponse.json({accepted},{status:accepted?200:409});}
 return NextResponse.json({error:'Not found'},{status:404});
 }catch{return NextResponse.json({error:'Invalid request'},{status:400});}}
