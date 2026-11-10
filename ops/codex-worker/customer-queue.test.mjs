import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pollCustomerQueue } from './customer-queue.mjs';

test('ready jobs drain serially without the old five-second cooldown', async () => {
  const delays = [], jobs = ['processed', 'processed', 'idle', 'idle', 'idle', 'idle', 'idle'];
  let calls = 0, stop = false;
  await pollCustomerQueue({
    stopped: () => stop,
    runOnce: async () => { calls++; return jobs.shift(); },
    wait: async ms => { delays.push(ms); if (!jobs.length) stop = true; },
  });
  assert.equal(calls, 7);
  assert.deepEqual(delays, [1000, 2000, 4000, 5000, 5000]);
});

test('errors retain backoff; a successful job resets only the idle schedule', async () => {
  const jobs = ['failed', 'idle', 'processed', 'idle'], delays = [];
  let stop = false;
  await pollCustomerQueue({
    stopped: () => stop,
    runOnce: async () => jobs.shift(),
    wait: async ms => { delays.push(ms); if (!jobs.length) stop = true; },
  });
  assert.deepEqual(delays, [5000, 5000, 1000]);
});

test('a slow leased job cannot be overlapped by another claim, and stop prevents another claim', async () => {
  let finish, calls = 0, stop = false;
  const running = pollCustomerQueue({
    stopped: () => stop,
    runOnce: async () => { calls++; await new Promise(resolve => { finish = resolve; }); return 'processed'; },
    wait: async () => assert.fail('No cooldown after stop'),
  });
  await Promise.resolve();
  assert.equal(calls, 1);
  stop = true;
  finish();
  await running;
  assert.equal(calls, 1);
});

test('an unrecoverable lifecycle failure does not start another claim', async () => {
  let calls = 0;
  await assert.rejects(pollCustomerQueue({
    stopped: () => false,
    runOnce: async () => { calls++; throw Error('cleanup failed'); },
    wait: async () => assert.fail('Unexpected retry'),
  }), /cleanup failed/);
  assert.equal(calls, 1);
});
