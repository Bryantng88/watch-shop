import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { prepareWorkImage } from "./work-image-processing";
import { workMediaDeleteEligible } from "./work-media-retention";
import { isWorkMediaKey, assertNotWorkMediaKey } from "@/domains/media/core/work-media-privacy";
import { boundedWorkImageForm } from "./work-media-http";

test("image normalization applies orientation, bounds size and strips EXIF",async()=>{
 const source=await sharp({create:{width:2300,height:1200,channels:3,background:"#aabbcc"}}).jpeg().withMetadata({orientation:6}).toBuffer();
 const output=await prepareWorkImage(source,"image/jpeg"),meta=await sharp(output).metadata();
 assert.equal(meta.format,"webp");assert.ok((meta.width||0)<=2048&&(meta.height||0)<=2048);assert.ok((meta.height||0)>(meta.width||0));assert.equal(meta.exif,undefined);
 await assert.rejects(prepareWorkImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),"image/png"));
 await assert.rejects(prepareWorkImage(Buffer.alloc(10*1024*1024+1),"image/png"),/10 MB/);
 await assert.rejects(prepareWorkImage(source,"image/svg+xml"));
});
test("private work keys cannot use generic image routes or ingestion",()=>{
 for(const key of ["media/work/objects/a/original/image.webp","/media//work/objects/a/original/image.webp","media/objects/../work/objects/a/original/image.webp"]){assert.equal(isWorkMediaKey(key),true);assert.throws(()=>assertNotWorkMediaKey(key));}
 assert.equal(isWorkMediaKey("media/objects/a/original/image.webp"),false);assert.equal(isWorkMediaKey("media/men/inline/a.jpg"),false);
});
test("retention never deletes referenced/recent/private-outside-scope objects",()=>{
 const now=new Date("2026-11-23T00:00:00Z"),old=new Date("2026-09-01T00:00:00Z");
 const base={key:"media/work/objects/a/original/image.webp",now,createdAt:old,bindingDates:[old],activeBindings:0,derivatives:0,productReferences:0,recentUploads:0};
 assert.equal(workMediaDeleteEligible(base),true);
 for(const change of [{activeBindings:1},{derivatives:1},{productReferences:1},{recentUploads:1},{bindingDates:[now]},{createdAt:now},{key:"media/objects/a/original/image.webp"}])assert.equal(workMediaDeleteEligible({...base,...change}),false);
});
test("multipart body is bounded even without Content-Length",async()=>{
 const oversized=new Request("http://localhost/upload",{method:"POST",body:Buffer.alloc(12*1024*1024),headers:{"content-type":"multipart/form-data; boundary=x"}});
 await assert.rejects(boundedWorkImageForm(oversized),/10 MB/);
 const form=new FormData();form.set("uploadId","fixture");form.set("file",new File(["test"],"a.jpg",{type:"image/jpeg"}));
 const parsed=await boundedWorkImageForm(new Request("http://localhost/upload",{method:"POST",body:form}));assert.equal(parsed.get("uploadId"),"fixture");
});
