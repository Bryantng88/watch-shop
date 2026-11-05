import { customerAssistantReady } from "../src/domains/ai-assistant/server/access";
import { prisma } from "../src/server/db/client";
async function main(){
 const ready=customerAssistantReady();let schema=false,technicalCatalog=0;
 if(ready){try{await prisma.customerAssistantConversation.count();schema=true;technicalCatalog=await prisma.technicalDetailCatalog.count({where:{isActive:true}});}catch{schema=false;}}
 console.log(JSON.stringify({customerAssistant:{enabled:process.env.CUSTOMER_AI_ENABLED==="1",targetReady:ready,schemaReady:schema,activeTechnicalCatalogEntries:technicalCatalog,approvalRequired:true,workerFlag:"CUSTOMER_AI_WORKER=1",productionEnabled:false}},null,2));
 if(process.env.CUSTOMER_AI_ENABLED==="1"&&(!ready||!schema))process.exitCode=1;
}
main().catch(()=>{console.error("Customer assistant configuration check failed; no credentials logged.");process.exitCode=1;}).finally(()=>prisma.$disconnect());
