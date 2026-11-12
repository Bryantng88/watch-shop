import {test} from 'node:test';
import assert from 'node:assert/strict';
import {personalWorkUpdateLabel} from './personal-work-update-label';
const createdAt='2026-11-12T01:00:00Z';
test('new unchanged work has no update badge; field-only changes remain visible',()=>{
 assert.equal(personalWorkUpdateLabel({createdAt,updatedAt:createdAt,activities:[]}),null);
 const result=personalWorkUpdateLabel({createdAt,updatedAt:'2026-11-12T02:00:00Z',activities:[]},new Date('2026-11-12T02:05:00Z'));
 assert.equal(result?.label,'Cập nhật 5 phút trước');
});
test('a checklist edit immediately after creation is visible with its actual detail',()=>{
 const result=personalWorkUpdateLabel({createdAt,updatedAt:createdAt,activities:[{title:'Sửa đầu việc',body:'Cũ → Mới',occurredAt:'2026-11-12T01:00:00.100Z'}]},new Date('2026-11-12T01:00:00.200Z'));
 assert.equal(result?.label,'Cập nhật vừa xong');assert.equal(result?.detail,'Sửa đầu việc: Cũ → Mới');
});
