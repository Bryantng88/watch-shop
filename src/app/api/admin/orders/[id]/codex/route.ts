import {NextRequest,NextResponse} from 'next/server';
import {getCurrentUserPermissions} from '@/server/auth/requirePermission';
import {listOrderWorkflows,requestOrderWorkflow,approveOrderWorkflow,WorkflowError} from '@/domains/order/codex/workflow.service';
import {ZodError} from 'zod';
type Context={params:Promise<{id:string}>};
async function handle(req:NextRequest,ctx:Context,write:boolean){try{
 const {user}=await getCurrentUserPermissions();if(!user)return NextResponse.json({error:'Cần đăng nhập'},{status:401});
 const id=(await ctx.params).id;
 if(!write)return NextResponse.json(await listOrderWorkflows(id,user.id));
 if(req.headers.get('origin')!==new URL(process.env.APP_URL!).origin)return NextResponse.json({error:'Origin không hợp lệ'},{status:403});
 const text=await req.text();if(text.length>64000)return NextResponse.json({error:'Yêu cầu quá dài'},{status:413});const body=JSON.parse(text);
 const result=body.action==='approve'?await approveOrderWorkflow(id,user.id,body.input):body.action==='request'?await requestOrderWorkflow(id,user.id,body.input):null;
 if(!result)return NextResponse.json({error:'Thao tác không hợp lệ'},{status:400});return NextResponse.json(result);
 }catch(e){return NextResponse.json({error:e instanceof WorkflowError?e.message:e instanceof ZodError?'Nội dung đề xuất không hợp lệ.':'Không thể xử lý yêu cầu Codex.'},{status:e instanceof WorkflowError?e.status:400});}}
export async function GET(req:NextRequest,ctx:Context){return handle(req,ctx,false)}
export async function POST(req:NextRequest,ctx:Context){return handle(req,ctx,true)}
