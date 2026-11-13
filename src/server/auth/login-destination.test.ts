import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loginDestination } from './login-destination';
test('login returns Ben and other admin destinations without opening an external redirect', () => {
  assert.equal(loginDestination('/admin/ben'), '/admin/ben');
  assert.equal(loginDestination('/admin/personal-work?view=list&item=item-23'), '/admin/personal-work?view=list&item=item-23');
  assert.equal(
    loginDestination('/admin/orders?view=all'),
    '/admin/orders?view=all'
  );
  for (const value of [
    undefined,
    ['/admin/ben'],
    'https://evil.test',
    '//evil.test',
    '/adminish',
    '/admin/../login',
    '/admin/%2e%2e/login',
    '/admin/\\evil',
    '/admin/%5c%5cevil',
    '/admin/%0aevil',
    '/admin/%',
  ])
    assert.equal(loginDestination(value), '/admin/dashboard');
});
