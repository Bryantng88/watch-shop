import assert from "node:assert/strict";
import test from "node:test";
import {newConversation} from "./simulation";
import {waitingMediaDraft} from "./media-insight";

test("a loaded media question still accepts insight without a pending browser submission", () => {
  const chat = newConversation(null);
  chat.messages = [{
    id:"question",
    role:"assistant",
    text:"Ở chiếc này, bạn ấn tượng nhất điểm gì?",
    mediaDraftRequest:{mode:"draft",productId:"bulova",sourceMessageId:"request"},
  }];
  assert.equal(waitingMediaDraft(chat,"bulova"),"request");
  assert.equal(waitingMediaDraft(chat,"another-watch"),undefined);
  chat.messages.push({id:"other",role:"assistant",text:"Chủ đề khác"});
  assert.equal(waitingMediaDraft(chat,"bulova"),undefined);
});
