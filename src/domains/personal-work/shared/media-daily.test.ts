import assert from 'node:assert/strict';import {test} from 'node:test';
import {mediaDayToday,mediaDaySchema,mediaChecklistContext,mediaDailyRequestSchema} from './media-daily';
test('daily grouping uses the Vietnam date, including UTC day boundaries and leap dates',()=>{
 assert.equal(mediaDayToday(new Date('2026-11-13T16:59:59Z')),'2026-11-13');assert.equal(mediaDayToday(new Date('2026-11-13T17:00:00Z')),'2026-11-14');assert.throws(()=>mediaDaySchema.parse('2026-02-29'));assert.equal(mediaDaySchema.parse('2028-02-29'),'2028-02-29');
});
test('checklist context only emits a server-constructed media link from bounded structured watch data',()=>{
 const source={source:'WATCH_MEDIA_DAILY',productId:'watch_1',watchTitle:'Bulova Oceanographer',sku:'BLV-1',part:'image',request:'Chỉnh gallery'};
 assert.equal(mediaChecklistContext(JSON.stringify(source))?.href,'/admin/watches/watch_1/edit?mode=media&focus=image');assert.equal(mediaChecklistContext('plain note'),undefined);assert.equal(mediaChecklistContext(JSON.stringify({...source,href:'https://evil.invalid'})),undefined);assert.equal(mediaChecklistContext(JSON.stringify({...source,productId:'../../secret'})),undefined);
 assert.throws(()=>mediaDailyRequestSchema.parse({...source,requestKey:'not-uuid',assigneeUserId:'u',day:'2026-11-13'}));
});
