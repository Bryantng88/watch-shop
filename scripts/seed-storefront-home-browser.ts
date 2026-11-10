import {randomUUID} from "node:crypto";
import {readFile,writeFile,unlink} from "node:fs/promises";
import {prisma} from "../src/server/db/client";
import {createAuthToken} from "../src/server/auth/auth-token";
async function main(){
 const db=new URL(process.env.DATABASE_URL||"");
 if(db.hostname!=="127.0.0.1"||db.pathname!=="/personal_codex_test")throw Error("Synthetic loopback database only");
 const path=process.env.BEN_PWA_FIXTURE_FILE||"/tmp/home-editor-fixture.json";
 if(process.argv.includes("--cleanup")){
  const fixture=JSON.parse(await readFile(path,"utf8")) as {ids:string[]};
  if(!Array.isArray(fixture.ids)||fixture.ids.some(id=>typeof id!=="string"))throw Error("Invalid fixture");
  await prisma.user.updateMany({where:{id:{in:fixture.ids},name:"Website UI Fixture",email:{endsWith:"@example.invalid"}},data:{isActive:false}});
  await unlink(path);console.log("Deactivated synthetic accounts and removed token fixture.");return;
 }
 if((process.env.AUTH_SECRET?.length||0)<32)throw Error("Provide a synthetic AUTH_SECRET");
 for(const code of ["PRODUCT_UPDATE","REPORT_SALES_VIEW"])await prisma.permission.upsert({where:{code},create:{code},update:{}});
 const admin=await prisma.role.upsert({where:{name:"ADMIN"},create:{name:"ADMIN"},update:{}});
 const limited=await prisma.role.create({data:{name:"website-limited-"+randomUUID(),permissions:{connect:[{code:"PRODUCT_UPDATE"},{code:"REPORT_SALES_VIEW"}]}}});
 const users=[];
 for(const role of [admin,limited])users.push(await prisma.user.create({data:{name:"Website UI Fixture",email:randomUUID()+"@example.invalid",roles:{connect:{id:role.id}}}}));
 await writeFile(path,JSON.stringify({ids:users.map(u=>u.id),token:createAuthToken(users[0].id),limitedToken:createAuthToken(users[1].id)}),{mode:0o600});
 console.log("Created a private synthetic website browser fixture.");
}
main().finally(()=>prisma.$disconnect()).catch(error=>{console.error(error);process.exitCode=1;});
