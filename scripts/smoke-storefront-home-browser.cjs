const { chromium } = require("playwright");
const fs = require("fs/promises"),
  assert = require("assert/strict");
(async () => {
  const f = JSON.parse(
    await fs.readFile(process.env.BEN_PWA_FIXTURE_FILE || "/tmp/home-editor-fixture.json", "utf8"),
  );
  f.home = require("../src/domains/storefront/content/contract.ts").defaultHome();
  const browser = await chromium.launch({
    executablePath: process.env.BEN_PWA_CHROMIUM || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } }),
      page = await context.newPage();
    await context.addCookies([
      { name: "auth_token", value: f.token, url: "http://127.0.0.1:3016" },
    ]);
    let record = {
        id: "home",
        kind: "HOME",
        draft: f.home,
        revision: 0,
        publishedAt: null,
        updatedAt: null,
      },
      published = null;
    const actions = [];
    let failNextSave=false;
    const key = "storefront/editorial/fixture.webp",uploadedKey="storefront/editorial/uploaded-fixture.webp";
    await context.route("**/api/admin/storefront/content*", async (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON();
        if(failNextSave){failNextSave=false;return route.fulfill({status:503,json:{error:"Kết nối gián đoạn. Nội dung chưa lưu."}});}
        await new Promise(resolve=>setTimeout(resolve,150));
        actions.push(body.action);
        assert.equal(body.id, "home");
        assert.equal(body.scope, "home");
        assert.equal(body.revision, record.revision);
        record = { ...record, draft: body.content, revision: record.revision + 1 };
        if (body.action === "publish") {
          published = structuredClone(body.content);
          record.publishedAt = new Date().toISOString();
        }
        return route.fulfill({ json: { record } });
      }
      return route.fulfill({ json: { record, articles: [] } });
    });
    await context.route("**/api/admin/storefront/media", (route) =>
      route.fulfill({
        json:
          route.request().method() === "POST"
            ? { item: { key:uploadedKey, name: "Uploaded image", url: "/temp_watch.jpg" } }
            : {
                items: [{ key, name: "Fixture image", url: "/temp_watch.jpg" }],
                truncated: false,
              },
      }),
    );
    await context.route("**/api/admin/storefront/products*", (route) =>
      route.fulfill({ json: { items: [] } }),
    );
    await context.route("**/storefront-preview*", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<html><body>Private draft preview fixture</body></html>",
      }),
    );
    await page.goto("http://127.0.0.1:3016/admin/storefront/home");
    await page.getByRole("heading", { name: "Trang chủ website", exact: true }).waitFor();
    await page.getByText(/lưu ý về cách hiển thị ảnh/).waitFor();
    const sectionNav=page.getByRole("region",{name:"Các khối trang chủ"});
    assert.equal(await sectionNav.locator(".sfc-section-row").count(),6);
    assert.equal(await page.locator(".sfc-section-editor:visible").count(),1);
    assert.ok(await page.locator('a[href="/admin/storefront/home"]').count());
    assert.equal(await page.getByRole("button", { name: "Tạo bài", exact: true }).count(), 0);
    assert.equal(await page.getByText("Thông tin chung & footer", { exact: true }).count(), 0);
    const publish = page.getByRole("button", { name: "Xuất bản", exact: true });
    assert.ok(await publish.isEnabled());
    await page.getByLabel("Tông màu khối mở đầu").selectOption("charcoal");
    const [chooser]=await Promise.all([page.waitForEvent("filechooser"),page.getByRole("button",{name:"Tải Ảnh desktop",exact:true}).press("Enter")]);
    await chooser.setFiles(require("node:path").join(__dirname,"../public/temp_watch.jpg"));
    await page.waitForFunction(value=>document.querySelector('select[aria-label="Chọn Ảnh desktop"]').value===value,uploadedKey);
    await page.getByLabel("Chọn Ảnh desktop", { exact: true }).selectOption(key);
    await sectionNav.getByRole("button",{name:/^Về Vintic/}).click();
    await page.locator("#home-editor-about").getByLabel("Tiêu đề",{exact:true}).fill("Nội dung giới thiệu đã sửa");
    assert.equal(await page.locator(".sfc-section-editor:visible").count(),1);
    await sectionNav.getByRole("button",{name:/^Ảnh mở đầu/}).click();
    assert.equal(await page.getByLabel("Tông màu khối mở đầu").inputValue(),"charcoal");
    // Rail: one Reports entry, accessible flyout, no extra report icons.
    const reports=page.getByRole("button",{name:"Báo cáo",exact:true});
    assert.equal(await reports.count(),1);
    assert.equal(await page.getByRole("link",{name:"Tài chính",exact:true}).count(),0);
    await reports.focus();await reports.press("ArrowDown");
    await page.getByRole("link",{name:"Tổng quan",exact:true}).waitFor();
    assert.equal(await page.getByRole("link",{name:"Tài chính",exact:true}).count(),1);
    await page.keyboard.press("Escape");assert.equal(await reports.getAttribute("aria-expanded"),"false");
    await page.getByRole("button",{name:"Mở rộng thanh điều hướng",exact:true}).click();
    await reports.click();await page.getByRole("link",{name:"Bán hàng & truy cập",exact:true}).waitFor();
    await reports.click();
    const left=await sectionNav.boundingBox();assert.ok(left.x>=240,"expanded sidebar must not cover the editor");
    failNextSave=true;
    await page.getByRole("button",{name:"Lưu nháp",exact:true}).click();
    await page.getByText("Kết nối gián đoạn. Nội dung chưa lưu.",{exact:true}).waitFor();
    assert.equal(await page.getByLabel("Tông màu khối mở đầu").inputValue(),"charcoal");
    await page.getByRole("button",{name:"Tải lại bản mới",exact:true}).waitFor();
    await page.getByRole("button",{name:"Đóng thông báo",exact:true}).click();
    await page.getByRole("button", { name: "Lưu nháp", exact: true }).click();
    await page.getByRole("status").filter({hasText:"Đã lưu nháp"}).waitFor();
    assert.equal(published, null);
    assert.equal(record.draft.hero.theme, "charcoal");
    await page.getByRole("button", { name: "Xem trước", exact: true }).click();
    await page.getByRole("dialog", { name: "Xem trước Storefront" }).waitFor();
    await page.getByRole("button", { name: "Mobile", exact: true }).click();
    assert.equal(
      await page.locator('iframe[title="Bản nháp storefront"]').evaluate((el) => el.style.width),
      "390px",
    );
    await page.getByRole("button", { name: "Đóng xem trước" }).click();
    assert.equal(published, null);
    await publish.click();
    await page.getByRole("status").filter({ hasText: "Đã xuất bản phiên bản mới." }).waitFor();
    assert.equal(published.hero.theme, "charcoal");
    assert.equal(published.about.title,"Nội dung giới thiệu đã sửa");
    assert.equal(published.about.image.key,"");
    assert.equal(published.general.tagline, f.home.general.tagline);
    assert.deepEqual(actions, ["save", "save", "publish"]);
    await page.screenshot({
      path: process.env.HOME_EDITOR_SCREENSHOT || "/tmp/storefront-home-manager.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.getByRole("combobox",{name:/^Khối đang sửa/}).selectOption("about");
    await page.locator("#home-editor-about").getByLabel("Tiêu đề",{exact:true}).waitFor();
    assert.equal(await page.locator(".sfc-section-editor:visible").count(),1);
    await page.getByRole("combobox",{name:/^Khối đang sửa/}).selectOption("hero");
    await page.screenshot({path:process.env.HOME_EDITOR_MOBILE_SCREENSHOT||"/tmp/storefront-home-mobile.png",fullPage:true});
    // Mobile nav exposes the same grouped reports, with readable labels.
    await page.getByRole("button",{name:"Menu",exact:true}).click();
    await page.getByRole("button",{name:"Báo cáo",exact:true}).click();
    await page.getByRole("link",{name:"Tài chính",exact:true}).waitFor();
    await page.getByRole("button",{name:"Close menu",exact:true}).click();
    const restricted=await browser.newContext({viewport:{width:1440,height:1000}});
    await restricted.route("**/api/admin/storefront/content*",route=>route.fulfill({json:{record,articles:[]}}));
    await restricted.route("**/api/admin/storefront/media",route=>route.fulfill({json:{items:[],truncated:false}}));
    await restricted.route("**/api/admin/storefront/products*",route=>route.fulfill({json:{items:[]}}));
    await restricted.addCookies([{name:"auth_token",value:f.limitedToken,url:"http://127.0.0.1:3016"}]);
    const limitedPage=await restricted.newPage();
    await limitedPage.goto("http://127.0.0.1:3016/admin/storefront/home");
    await limitedPage.getByRole("button",{name:"Báo cáo",exact:true}).click();
    await limitedPage.getByRole("link",{name:"Bán hàng & truy cập",exact:true}).waitFor();
    assert.equal(await limitedPage.getByRole("link",{name:"Tài chính",exact:true}).count(),0);
    assert.equal(await limitedPage.getByRole("link",{name:"Tổng quan",exact:true}).count(),0);
    await restricted.close();
    console.log(
      "PASS real browser: authenticated home menu, home-only controls, focused section editing, state retained on section switch, optional-photo guidance, theme/library selection, draft save, desktop/mobile preview controls, explicit publish, mobile width, grouped Reports in rail/expanded/mobile menus, keyboard Escape and per-report permission filtering. Editor API and preview frame use fixtures; storage/AI/production not exercised.",
    );
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
