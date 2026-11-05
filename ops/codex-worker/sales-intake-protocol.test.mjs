import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateSalesTurn, runSalesIntakeConversation } from './sales-intake-protocol.mjs';
import { salesCodexArguments } from './sales-worker.mjs';
import { readFileSync } from 'node:fs';
const lookup = (tool='customers.search', extra={}) => ({ type:'lookup', tool, query:'Customer fixture', productId:null, customerId:null, plan:null, ...extra });
const finish = plan => ({ type:'finish', tool:null, query:null, productId:null, customerId:null, plan });

test('CLI schema enforces the server lead-key format and bounded plan fields', () => {
 const schema=JSON.parse(readFileSync(new URL('./sales-turn-schema.json',import.meta.url),'utf8'));
 const plan=schema.properties.plan.anyOf.find(s=>s.type==='object');
 const key=new RegExp(plan.properties.leads.items.properties.key.pattern);
 for(const value of ['l1','customer-2'])assert.ok(key.test(value));
 for(const value of ['1','Customer A','a'.repeat(31),'972ef8e2-e459-4bf8-8785-d59aac747d3d'])assert.equal(key.test(value),false);
 assert.equal(plan.properties.summary.maxLength,1500);assert.equal(plan.properties.leads.maxItems,3);
 assert.equal(plan.properties.leads.items.properties.followups.maxItems,5);
});

test('lookup protocol rejects writes, extra fields, unused arguments and wrong finish shape', () => {
 for (const turn of [lookup('orders.create'), {...lookup(),sql:'select * from customer'}, lookup('customers.search',{productId:'p'}), {...finish({}),query:'hidden command'}, lookup('work.open',{query:null,productId:'p',customerId:null})]) assert.throws(()=>validateSalesTurn(turn));
 assert.deepEqual(validateSalesTurn(lookup('work.open',{query:null,productId:'p',customerId:'c'})).lookup,{tool:'work.open',productId:'p',customerId:'c'});
});

test('model can request evidence, see the result, then finish exactly once', async () => {
 const calls=[];let prompts=[];
 const turns=[lookup(),finish({summary:'fixture',questions:[],leads:[]})];
 await runSalesIntakeConversation({id:'r',leaseToken:'l',text:'Synthetic inquiry'}, {execute:async prompt=>{prompts.push(prompt);return turns.shift()},api:async(op,data)=>{calls.push(op);return op==='lookup'?{evidence:{id:'e',result:{matches:[{id:'customer-fixture'}]}}}:{accepted:true}}});
 assert.deepEqual(calls,['lookup','finish']);assert.ok(prompts[1].includes('customer-fixture'));assert.ok(prompts[0].includes('NEVER execute CLI tools'));
});

test('repeated lookups, exhausted budget and lost leases never publish a plan', async () => {
 const calls=[];
 await assert.rejects(runSalesIntakeConversation({id:'r',text:'fixture'},{execute:async()=>lookup(),api:async op=>{calls.push(op);return{evidence:{}}}}),/REPEATED_LOOKUP/);
 assert.deepEqual(calls,['lookup']);
 let active=true;
 await assert.rejects(runSalesIntakeConversation({id:'r',text:'fixture'},{assertActive:()=>{if(!active)throw Error('lease lost')},execute:async()=>{active=false;return finish({})},api:async()=>{throw Error('must not execute')}}),/lease lost/);
 let count=0;
 await assert.rejects(runSalesIntakeConversation({id:'r',text:'fixture'},{execute:async()=>lookup('watches.search',{query:'SKU-'+count++}),api:async()=>({evidence:{}})}),/LOOKUP_LIMIT/);
});

test('sales CLI keeps read-only/no-network permissions and credential/repository denies',()=>{
 const args=salesCodexArguments('/work/sales-runs/fixture','/work/results/fixture.json');
 assert.ok(args.some(a=>a.includes('extends=":read-only"')));
 for(const path of ['/var/lib/codex/auth/auth.json','/proc','/run/worker','/work/results','/work/repo','/work/runs','/work/order-runs'])assert.ok(args.some(a=>a.includes('"'+path+'"="deny"')));
 assert.ok(args.some(a=>a.includes('network={enabled=false}')));assert.ok(args.includes('shell_environment_policy.inherit="none"'));
 assert.equal(args.some(a=>a.includes('dangerously-bypass')),false);
});
