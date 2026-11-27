import test from "node:test";
import assert from "node:assert/strict";
import { validateMediaMerge, mediaMergeSelection, type MediaMergeCandidate } from "./media-merge";
const candidate=(id:string):MediaMergeCandidate=>({id,title:"Media",ownerId:"owner",status:"TODO",locked:false,categoryId:null,workType:"GENERAL_TASK",shares:["vi:EDITOR"],entries:[{id:id+"-done",isDone:true,media:true},{id:id+"-open",isDone:false,media:true}],calendar:false,running:false,merged:false});
test("media merge preserves eligibility of mixed completed/open entries",()=>assert.doesNotThrow(()=>validateMediaMerge([candidate("a"),candidate("b")],"owner")));
for(const [name,patch] of Object.entries({"other owner":{ownerId:"other"},"viewer widening":{shares:["vi:VIEWER"]},"finished source":{status:"DONE"},"locked source":{locked:true},"merged source":{merged:true},"calendar":{calendar:true},"worker":{running:true},"different category":{categoryId:"custom"},"different kind":{workType:"EVENT"},"non-media entry":{entries:[{id:"bad",isDone:false,media:false}]}}))test(`reject ${name}`,()=>assert.throws(()=>validateMediaMerge([candidate("a"),{...candidate("b"),...patch}],"owner")));
test("all completed entries and duplicate selection fail closed",()=>{
  assert.throws(()=>validateMediaMerge([candidate("a"),candidate("b")].map(r=>({...r,entries:r.entries.map(e=>({...e,isDone:true}))})),"owner"));
  assert.equal(mediaMergeSelection.safeParse({ids:["a","a"]}).success,false);
});
