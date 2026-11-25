import { retainWorkMedia } from "../src/domains/work-media/server/work-media-retention";
import { prisma } from "../src/server/db/client";
// Read-only unless --apply is explicitly supplied by an authorized operator.
retainWorkMedia(process.argv.includes("--apply")).then(result=>console.log(JSON.stringify(result,null,2))).catch(error=>{console.error(error instanceof Error?error.message:"Work media retention failed");process.exitCode=1;}).finally(()=>prisma.$disconnect());
