import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newShareRecipients,reminderKey,safeWorkPushRoute,workRoute} from './work-push-policy';
test('sharing informs only newly added people, excluding actor and duplicate recipients',()=>{
 assert.deepEqual(newShareRecipients(['existing'],['existing','new','new','actor'],'actor'),['new']);
});
test('rescheduling and changing reminder advance time create distinct reminder identities',()=>{
 const date=new Date('2026-11-12T02:00:00Z');
 assert.notEqual(reminderKey('i','u',date),reminderKey('i','u',date,15));
 assert.notEqual(reminderKey('i','u',date),reminderKey('i','u',new Date(date.getTime()+60000)));
});
test('notification destinations are fixed internal work routes',()=>{
 for(const value of ['https://evil.invalid','//evil.invalid','/admin/users','/admin/personal-work?item=x&next=https://evil.invalid',null])assert.equal(safeWorkPushRoute(value),'/admin/ben');
 for(const personal of [true,false])assert.equal(safeWorkPushRoute(workRoute('abc-123',personal)),workRoute('abc-123',personal));
});
