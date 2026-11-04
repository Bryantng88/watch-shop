import { prisma } from "../src/server/db/client";
import { buildOrderDetailProjectionRow } from "../src/domains/projection/server/order-detail.projection";
async function main() {
  const url=new URL(process.env.DATABASE_URL || "");
  if(url.hostname!=="127.0.0.1"||url.port!=="54339"||url.pathname!=="/watch_shop_local_test_utf8")throw Error("Dedicated local assistant demo database required");
  let order=await prisma.order.findFirst({where:{refNo:"LOCAL-AI-DEMO-001"}});
  if(!order)order=await prisma.order.create({data:{refNo:"LOCAL-AI-DEMO-001",shipPhone:"local-demo",shipAddress:"Địa chỉ mẫu",shipCity:"Local",subtotal:0,hasShipment:false,orderItem:{create:{title:"Đồng hồ mẫu kiểm thử trợ lý",listPrice:0,unitPriceAgreed:0,quantity:1,subtotal:0,kind:"PRODUCT"}}}});
  await buildOrderDetailProjectionRow(prisma,order.id);
  console.log("Demo order: http://127.0.0.1:3000/admin/orders/"+order.id);
}
main().catch(()=>{console.error("Local demo seed failed; no production target allowed.");process.exitCode=1;}).finally(()=>prisma.$disconnect());
