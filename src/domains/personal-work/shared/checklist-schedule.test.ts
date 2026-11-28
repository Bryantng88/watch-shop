import assert from "node:assert/strict";
import {test} from "node:test";
import {checklistScheduleRange,validateChecklistSchedule} from "./checklist-schedule";
test("earliest start and latest deadline include completed entries and ignore unscheduled",()=>{
 assert.deepEqual(checklistScheduleRange([{startAt:"2026-11-28T09:00:00+07:00",deadlineAt:"2026-11-29T17:00:00+07:00"},{startAt:"2026-11-27T08:00:00+07:00",deadlineAt:"2026-12-01T18:00:00+07:00"},{}]),{dueAt:"2026-11-27T01:00:00.000Z",scheduledEndAt:"2026-12-01T11:00:00.000Z"});
 assert.deepEqual(checklistScheduleRange([]),{dueAt:null,scheduledEndAt:null});
 assert.deepEqual(checklistScheduleRange([{deadlineAt:"2026-11-28T17:00:00+07:00"}]),{dueAt:"2026-11-28T10:00:00.000Z",scheduledEndAt:null});
});
test("deadline-only and unset are allowed; invalid or reversed ranges are rejected",()=>{
 assert.equal(validateChecklistSchedule(null,null).deadlineAt,null);
 assert.ok(validateChecklistSchedule(null,"2026-11-28T17:00:00+07:00").deadlineAt);
 assert.throws(()=>validateChecklistSchedule("bad",null));
 assert.throws(()=>validateChecklistSchedule("2026-12-01",null));
 assert.throws(()=>validateChecklistSchedule("2026-12-01","2026-11-28"));
 assert.doesNotThrow(()=>validateChecklistSchedule("2026-12-01","2026-12-01"));
});
