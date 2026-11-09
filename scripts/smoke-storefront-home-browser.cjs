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
    const key = "storefront/editorial/fixture.webp";
    await context.route("**/api/admin/storefront/content*", async (route) => {
      if (route.request().method() === "POST") {
        const body = route.request().postDataJSON();
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
            ? { item: { key, name: "Uploaded image", url: "/ben/icon-192.png" } }
            : {
                items: [{ key, name: "Fixture image", url: "/ben/icon-192.png" }],
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
    await page.getByText("Ảnh còn thiếu", { exact: true }).waitFor();
    assert.ok(await page.locator('a[href="/admin/storefront/home"]').count());
    assert.equal(await page.getByRole("button", { name: "Tạo bài", exact: true }).count(), 0);
    assert.equal(await page.getByText("Thông tin chung & footer", { exact: true }).count(), 0);
    const publish = page.getByRole("button", { name: "Xuất bản", exact: true });
    assert.ok(await publish.isDisabled());
    await page.getByLabel("Tông màu khối mở đầu").selectOption("charcoal");
    await page.getByLabel("Chọn Ảnh desktop", { exact: true }).selectOption(key);
    // The exact library labels are exposed by each home image field.
    await page
      .locator("summary")
      .filter({ hasText: /^Về Vintic$/ })
      .click();
    await page
      .locator("summary")
      .filter({ hasText: /^Bộ sưu tập theo phong cách$/ })
      .click();
    const choices = page.locator('select[aria-label^="Chọn "]');
    for (let i = 0; i < (await choices.count()); i++) {
      const name = await choices.nth(i).getAttribute("aria-label");
      if (!name.includes("mobile")) await choices.nth(i).selectOption(key);
    }
    assert.ok(await publish.isEnabled());
    await page.getByRole("button", { name: "Lưu nháp", exact: true }).click();
    await page.getByText("Đã lưu bản nháp.", { exact: false }).waitFor();
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
    await page.getByRole("status").filter({ hasText: "Đã xuất bản." }).waitFor();
    assert.equal(published.hero.theme, "charcoal");
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
    console.log(
      "PASS real browser: authenticated home menu, home-only controls, image readiness, theme/library selection, draft save, desktop/mobile preview controls, explicit publish and mobile width. Editor API and preview frame use fixtures; storage/AI/production not exercised.",
    );
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
