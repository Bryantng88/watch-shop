const { chromium } = require('playwright');
const fs = require('node:fs/promises'),
  assert = require('node:assert/strict');
(async () => {
  const fixture = JSON.parse(
    await fs.readFile(
      process.env.BEN_PWA_FIXTURE_FILE || '/tmp/ben-pwa-fixture.json',
      'utf8'
    )
  );
  assert.ok(
    fixture.email.endsWith('@example.invalid'),
    'Synthetic fixture required'
  );
  const browser = await chromium.launch({
    executablePath: process.env.BEN_PWA_CHROMIUM || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const origin = 'http://127.0.0.1:3015';
    for (const [path, type] of [
      ['/ben.webmanifest', 'application/manifest+json'],
      ['/ben-sw.js', 'javascript'],
      ['/ben/icon-192.png', 'image/png'],
      ['/ben/apple-touch-icon.png', 'image/png'],
    ]) {
      const r = await context.request.get(origin + path);
      assert.equal(r.status(), 200, path);
      assert.ok(r.headers()['content-type'].includes(type), path);
    }
    const sw = await context.request.get(origin + '/ben-sw.js');
    assert.equal(sw.headers()['service-worker-allowed'], '/admin/ben');
    assert.ok(sw.headers()['cache-control'].includes('no-store'));
    await context.route('**/api/admin/customer-assistant*', (route) =>
      route.fulfill({
        json: {
          conversations: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              context: null,
              title: 'PWA fixture',
              messages: [
                {
                  id: 'message',
                  role: 'assistant',
                  text: 'Synthetic private history',
                },
              ],
              steps: [],
              tasks: [],
              updatedAt: new Date().toISOString(),
              approved: false,
              runStatus: 'NEEDS_INFO',
              revision: 1,
            },
          ],
        },
      })
    );
    await page.goto(origin + '/admin/ben');
    await page.waitForURL('**/login?next=*');
    await page.getByLabel('Email', { exact: true }).fill(fixture.email);
    await page.getByLabel('Mật khẩu', { exact: true }).fill(fixture.password);
    await page.route('**/api/auth/login', (route) => route.abort('failed'));
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.getByText('Không kết nối được.', { exact: false }).waitFor();
    await page.unroute('**/api/auth/login');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.waitForURL('**/admin/ben');
    await page
      .getByText('Synthetic private history', { exact: true })
      .waitFor();
    assert.ok(
      (await context.request.get(origin + '/admin/ben'))
        .headers()
        ['cache-control'].includes('no-store')
    );
    await page.waitForFunction(
      () => Boolean(navigator.serviceWorker.controller),
      { timeout: 15000 }
    );
    const manifest = await page
      .locator('link[rel="manifest"]')
      .getAttribute('href');
    assert.equal(manifest, '/ben.webmanifest');
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
    const input = page.getByRole('textbox', { name: 'Tin nhắn cho Ben' });
    await input.fill('Tin nhắn chưa gửi');
    assert.ok(
      await input.evaluate(
        (el) => parseFloat(getComputedStyle(el).fontSize) >= 16
      )
    );
    await page.evaluate(() => {
      window.installCalls = 0;
      const e = new Event('beforeinstallprompt');
      e.prompt = async () => {
        window.installCalls++;
      };
      e.userChoice = Promise.resolve({ outcome: 'dismissed' });
      window.dispatchEvent(e);
    });
    await page.getByRole('button', { name: 'Cài Ben trên thiết bị' }).click();
    assert.equal(await page.evaluate(() => window.installCalls), 1);
    await page.getByText('iPhone/iPad:', { exact: false }).waitFor();
    await context.setOffline(true);
    await page.getByText('Đang mất kết nối.', { exact: false }).waitFor();
    assert.equal(await input.inputValue(), 'Tin nhắn chưa gửi');
    await context.setOffline(false);
    await page
      .getByText('Đang mất kết nối.', { exact: false })
      .waitFor({ state: 'hidden' });
    assert.equal(await input.inputValue(), 'Tin nhắn chưa gửi');
    await page.screenshot({
      path: process.env.BEN_PWA_SCREENSHOT || '/tmp/ben-pwa-mobile.png',
      fullPage: true,
    });
    await context.unroute('**/api/admin/customer-assistant*');
    await context.route('**/api/admin/customer-assistant*', (route) =>
      route.fulfill({ status: 401, json: { error: 'Unauthorized' } })
    );
    await page.evaluate(() =>
      document.dispatchEvent(new Event('visibilitychange'))
    );
    await page
      .getByRole('heading', { name: 'Đăng nhập lại để tiếp tục với Ben' })
      .waitFor();
    assert.equal(await page.getByText('Synthetic private history').count(), 0);
    assert.equal(
      await page
        .getByRole('link', { name: 'Đăng nhập lại', exact: true })
        .getAttribute('href'),
      '/login?next=%2Fadmin%2Fben'
    );
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('heading', { name: 'Ben đang chờ kết nối' }).waitFor();
    assert.equal(await page.getByText('Synthetic private history').count(), 0);
    assert.deepEqual(await page.evaluate(() => caches.keys()), []);
    assert.deepEqual(errors, []);
    console.log(
      'PASS browser: real login returns Ben, failed-login recovery, manifest/icons/headers, actual SW activation, mobile width/font, install consent, offline/online draft, session expiry scrubbing and uncached offline reload. OS installation/keyboard not simulated.'
    );
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
