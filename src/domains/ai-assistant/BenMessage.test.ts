import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import BenMessage, { safeBenLink } from "./BenMessage";
test("Ben renders bold and lists while keeping model HTML/images inert",()=>{
 const html=renderToStaticMarkup(React.createElement(BenMessage,{text:'**Đơn hàng**\n\n- Việc một\n- Việc hai\n\n<script>alert(1)</script>\n\n![ảnh](https://evil.test/a.png)'}));
 assert.ok(html.includes('<strong>Đơn hàng</strong>'));assert.ok(html.includes('<ul>'));assert.equal(html.includes('<script>'),false);assert.equal(html.includes('<img'),false);
});
test("only internal admin links are clickable; model URLs cannot execute or leave the app",()=>{
 for(const url of ['javascript:alert(1)','//evil.test','https://evil.test','/admin\\evil','/api/admin/orders','/admin\n/foo'])assert.equal(safeBenLink(url),undefined);
 const html=renderToStaticMarkup(React.createElement(BenMessage,{text:'[Mở việc](/admin/personal-work) [Ngoài](https://evil.test)'}));
 assert.ok(html.includes('href="/admin/personal-work"'));assert.equal(html.includes('href="https://evil.test"'),false);
});
