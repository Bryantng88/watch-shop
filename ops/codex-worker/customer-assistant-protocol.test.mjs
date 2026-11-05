import assert from 'node:assert/strict';import {test} from 'node:test';
import {runCustomerConversation,validateCustomerTurn} from './customer-assistant-protocol.mjs';import {customerCodexArguments} from './customer-assistant-worker.mjs';
const finish={type:'finish',tool:null,query:null,productId:null,customerId:null,reply:'Bạn muốn giao công việc cho ai?',plan:null};
test('missing information stays chat, never calls a business write',async()=>{const calls=[];await runCustomerConversation({id:'r',text:'fixture'},{execute:async()=>finish,api:async(op,body)=>{calls.push([op,body.plan]);return{accepted:true}}});assert.deepEqual(calls,[['finish',null]]);});
test('write tools and injected fields are rejected; two-character recipient search is allowed',()=>{assert.throws(()=>validateCustomerTurn({...finish,type:'lookup',tool:'orders.create',reply:null}));assert.throws(()=>validateCustomerTurn({...finish,sql:'select'}));assert.deepEqual(validateCustomerTurn({...finish,type:'lookup',tool:'people.search',query:'An',reply:null}).lookup,{tool:'people.search',query:'An'});});
test('read-only CLI keeps credential and other-workspace denies and no network',()=>{const args=customerCodexArguments('/work/customer-runs/r','/work/results/r.json').join(' ');for(const value of ['/run/worker','/proc','/work/repo','/work/runs','/work/order-runs','/work/sales-runs','/work/results','extends=":read-only"','network={enabled=false}'])assert.ok(args.includes(value));assert.equal(args.includes('dangerously-bypass'),false);});
test('lost lease and duplicate lookup never finish a proposal',async()=>{let calls=0;await assert.rejects(runCustomerConversation({id:'r',text:'fixture'},{execute:async()=>({...finish,type:'lookup',tool:'people.search',query:'An',reply:null}),api:async()=>{calls++;return{evidence:{}}}}),/REPEATED_LOOKUP/);assert.equal(calls,1);});
test('pre-order work lookup accepts a null customer without weakening other lookup fields',()=>{
 assert.deepEqual(validateCustomerTurn({...finish,type:'lookup',tool:'work.open',productId:'watch',customerId:null,reply:null}).lookup,{tool:'work.open',productId:'watch',customerId:null});
 assert.throws(()=>validateCustomerTurn({...finish,type:'lookup',tool:'work.open',productId:'watch',customerId:'',reply:null}));
});
test('image lookup accepts only a product ID, never model URLs or extra arguments',()=>{
 assert.deepEqual(validateCustomerTurn({...finish,type:'lookup',tool:'watches.images',productId:'watch',reply:null}).lookup,{tool:'watches.images',productId:'watch'});
 assert.throws(()=>validateCustomerTurn({...finish,type:'lookup',tool:'watches.images',productId:'watch',query:'https://evil.test',reply:null}));
 assert.throws(()=>validateCustomerTurn({...finish,type:'lookup',tool:'watches.images',productId:'watch',reply:null,url:'https://evil.test'}));
});

test('Ben identity is supplied on every lookup round and resumed conversation',async()=>{
 const prompts=[];let calls=0;
 await runCustomerConversation({id:'r',text:JSON.stringify({messages:[{role:'user',text:'Ben ơi, xem đồng hồ giúp mình'}],alreadyApproved:true})},{
  execute:async prompt=>{prompts.push(prompt);return calls++===0?{...finish,type:'lookup',tool:'watches.search',query:'Seiko',reply:null}:finish;},
  api:async op=>op==='lookup'?{evidence:{request:{tool:'watches.search',query:'Seiko'},result:{matches:[]}}}:{accepted:true}
 });
 assert.equal(prompts.length,2);
 for(const prompt of prompts){assert.ok(prompt.startsWith('You are Ben,'));assert.ok(prompt.includes('not naming a customer, employee or task recipient'));assert.ok(prompt.includes('not a human employee'));}
});

test('Ben has a factual, unprompted-story prohibition and free chat never bypasses server capabilities',async()=>{
 let supplied='';await runCustomerConversation({id:'r',text:'synthetic chat'},{execute:async prompt=>{supplied=prompt;return finish},api:async()=>({accepted:true})});
 for(const text of ["a cat Long deeply loves","Do not bring this up unprompted","no user-selected or pinned context","allowedLookups","Server checks remain authoritative"]){assert.ok(supplied.includes(text),text)}
});
test('malformed lookup receives one bounded format repair, never an invalid API call',async()=>{
 const calls=[];let attempt=0;await runCustomerConversation({id:'r',text:'synthetic'},{execute:async prompt=>{if(attempt++===0)return {...finish,type:'lookup',tool:'watches.search',query:'fixture',reply:'invalid mixed reply'};assert.ok(prompt.includes('FORMAT CORRECTION'));return finish},api:async op=>{calls.push(op);return {accepted:true}}});
 assert.equal(attempt,2);assert.deepEqual(calls,['finish']);
 let executions=0;await assert.rejects(runCustomerConversation({id:'r',text:'synthetic'},{execute:async()=>{executions++;return {...finish,sql:'forbidden'}},api:async()=>{throw Error('must not execute')}}),/INVALID_CUSTOMER_TURN/);assert.equal(executions,2);
});

test('permission support is a draft with no chosen recipient or business plan',async()=>{
 const offer={...finish,permissionRequest:'Cần Long xem xét quyền giao việc'};const calls=[];
 await runCustomerConversation({id:'r',text:'synthetic'},{execute:async()=>offer,api:async(op,body)=>{calls.push([op,body.permissionRequest]);return {accepted:true}}});
 assert.deepEqual(calls,[['finish',offer.permissionRequest]]);
 assert.throws(()=>validateCustomerTurn({...offer,plan:{}}));assert.throws(()=>validateCustomerTurn({...offer,type:'lookup'}));assert.throws(()=>validateCustomerTurn({...offer,assigneeUserId:'evil'}));
});

test('draft order format cannot request posting, payment writes or mix approvals',()=>{
 const order={customerId:null,customerName:'Synthetic customer',phone:null,hasShipment:false,address:null,city:null,district:null,ward:null,paymentMethod:'CASH',notes:null,items:[{productId:'watch',unitPriceAgreed:2000000}]};
 assert.ok(validateCustomerTurn({...finish,orderPlan:order}).orderPlan);
 for(const invalid of [{...order,status:'POSTED'},{...order,items:[{productId:'watch',unitPriceAgreed:0}]},{...order,hasShipment:true},{...order,paymentMethod:'COD'}])assert.throws(()=>validateCustomerTurn({...finish,orderPlan:invalid}),/INVALID_CUSTOMER_ORDER/);
 assert.throws(()=>validateCustomerTurn({...finish,orderPlan:order,permissionRequest:'Support'}));
 assert.throws(()=>validateCustomerTurn({...finish,unsupportedCapability:'Not supported',permissionRequest:'Support'}));
});

test('navigation uses a bounded key query and cannot carry business fields or URLs as extra fields',()=>{
 assert.deepEqual(validateCustomerTurn({...finish,type:'lookup',tool:'navigation.open',query:'personal-work',reply:null,navigationIntent:{type:'OPEN_SCREEN',sourceMessageId:'message'}}).lookup,{tool:'navigation.open',query:'personal-work',intent:{type:'OPEN_SCREEN',sourceMessageId:'message'}});
 assert.throws(()=>validateCustomerTurn({...finish,type:'lookup',tool:'navigation.open',query:'watches',productId:'watch',reply:null}));
 assert.throws(()=>validateCustomerTurn({...finish,type:'lookup',tool:'navigation.open',query:'watches',reply:null,href:'https://evil.test'}));
});

test('navigation requires structured current-user intent; stale or invented source never reaches the API',async()=>{
 const lookup={...finish,type:'lookup',tool:'navigation.open',query:'watches',reply:null};
 assert.throws(()=>validateCustomerTurn(lookup),/INVALID_CUSTOMER_NAVIGATION/);
 for(const intent of [{type:'DELETE',sourceMessageId:'current'},{type:'OPEN_SCREEN',sourceMessageId:''},{type:'OPEN_SCREEN',sourceMessageId:'current',href:'/admin/watches'}])assert.throws(()=>validateCustomerTurn({...lookup,navigationIntent:intent}));
 const calls=[];let attempts=0;
 await assert.rejects(runCustomerConversation({id:'r',text:JSON.stringify({currentUserMessage:{id:'current',text:'Navigate'}})},{execute:async()=>{attempts++;return {...lookup,navigationIntent:{type:'OPEN_SCREEN',sourceMessageId:'old'}}},api:async op=>{calls.push(op)}}),/INVALID_CUSTOMER_NAVIGATION_SOURCE/);
 assert.equal(attempts,2);assert.deepEqual(calls,[]);
});
