import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AUTH_TOKEN_MAX_AGE, AUTH_REMEMBER_MAX_AGE, createAuthToken, verifyAuthToken } from './auth-token';
test('normal and remembered tokens expire at their fixed boundary, with no implicit renewal',()=>{
 const now=1_800_000_000_000;
 for(const remember of [false,true]){
  const ttl=remember?AUTH_REMEMBER_MAX_AGE:AUTH_TOKEN_MAX_AGE;
  const token=createAuthToken('fixture-user',now,remember);
  assert.equal(verifyAuthToken(token,now)?.expiresAt,now/1000+ttl);
  assert.ok(verifyAuthToken(token,now+ttl*1000-1));
  assert.equal(verifyAuthToken(token,now+ttl*1000),null);
  assert.equal(verifyAuthToken(token,now+(ttl+1)*1000),null);
  const parts=token.split('.');parts[1]=String(Number(parts[1])+86400);
  assert.equal(verifyAuthToken(parts.join('.'),now),null);
 }
 assert.equal(AUTH_TOKEN_MAX_AGE,43200);assert.equal(AUTH_REMEMBER_MAX_AGE,2592000);
});
