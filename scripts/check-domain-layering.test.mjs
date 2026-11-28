import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import assert from "node:assert/strict";
import {test} from "node:test";

test("layer gate rejects direct and transitive server imports, permits type-only and Server Action RPC",()=>{
  const dir=fs.mkdtempSync(path.join("src",".layering-check-"));
  const files=[];
  function write(name,text){const file=path.join(dir,name);if(!files.includes(file))files.push(file);fs.writeFileSync(file,text);}
  const run=()=>spawnSync(process.execPath,["scripts/check-domain-layering.mjs"],{encoding:"utf8"});
  try{
    fs.mkdirSync(path.join(dir,"server"));
    write("server/read.ts","export type Row={id:string}; export const read=()=>null;");
    write("view.tsx",'"use client"; import {read} from "./server/read"; export const result=read();');
    let result=run();assert.equal(result.status,1);assert.match(result.stderr,/view.tsx -> .*server\/read.ts/);
    write("view.tsx",'"use client"; import type {Row} from "./server/read"; export type View=Row;');
    result=run();assert.equal(result.status,0,result.stderr);
    write("actions.ts",'"use server"; export async function read(){return null;}');
    write("view.tsx",'"use client"; import {read} from "./actions"; export const result=read;');
    result=run();assert.equal(result.status,0,result.stderr);
    write("bridge.ts",'export {read} from "./server/read";');
    write("view.tsx",'"use client"; import {read} from "./bridge"; export const result=read;');
    result=run();assert.equal(result.status,1);assert.match(result.stderr,/bridge.ts -> .*server\/read.ts/);
  }finally{
    for(const file of files.reverse())fs.unlinkSync(file);
    fs.rmdirSync(path.join(dir,"server"));fs.rmdirSync(dir);
  }
});
