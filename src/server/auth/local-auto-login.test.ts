import assert from "node:assert/strict";
import test from "node:test";
import { isLocalAutoLoginEnabled, isLocalAutoLoginRequestAllowed, isLoopbackHost } from "./local-auto-login";

const localEnv = {
    NODE_ENV: "development" as const,
    LOCAL_AUTO_LOGIN: "true",
    DATABASE_URL: "postgresql://127.0.0.1:5433/watch_shop_test",
    DIRECT_URL: "postgresql://127.0.0.1:5433/watch_shop_test",
};
function request(headers: Record<string, string> = {}) {
    return new Request("http://localhost:3000/api/auth/local-login", {
        method: "POST",
        headers: { host: "localhost:3000", origin: "http://localhost:3000", ...headers },
    });
}
test("requires explicit development opt-in and two local test DB URLs", () => {
    assert.equal(isLocalAutoLoginEnabled(localEnv), true);
    for (const overrides of [
        { NODE_ENV: "production" as const }, { NODE_ENV: "test" as const },
        { LOCAL_AUTO_LOGIN: undefined }, { LOCAL_AUTO_LOGIN: "false" },
        { DATABASE_URL: "postgresql://remote.example/test" },
        { DIRECT_URL: "postgresql://remote.example/test" },
        { DATABASE_URL: "postgresql://127.0.0.1/production" }, { DIRECT_URL: undefined },
    ]) assert.equal(isLocalAutoLoginEnabled({ ...localEnv, ...overrides }), false);
});
test("only exact loopback hosts pass", () => {
    for (const host of ["localhost:3000", "127.0.0.1:3000", "[::1]:3000"]) assert.equal(isLoopbackHost(host), true);
    for (const host of [null, "192.168.1.2:3000", "localhost.evil.test", "evil@localhost", "localhost/path"]) assert.equal(isLoopbackHost(host), false);
});
test("requires same-origin requests and rejects remote forwarded clients", () => {
    assert.equal(isLocalAutoLoginRequestAllowed(request(), localEnv), true);
    const rejectedHeaders: Record<string, string>[] = [
        { origin: "https://evil.example" }, { origin: "null" }, { origin: "http://localhost:3001" },
        { host: "remote.example" }, { "x-forwarded-host": "remote.example" },
        { "x-forwarded-for": "203.0.113.1" }, { "x-forwarded-for": "127.0.0.1, 203.0.113.1" },
        { "sec-fetch-site": "cross-site" },
    ];
    for (const headers of rejectedHeaders) assert.equal(isLocalAutoLoginRequestAllowed(request(headers), localEnv), false);
    assert.equal(isLocalAutoLoginRequestAllowed(request(), { ...localEnv, NODE_ENV: "production" }), false);
});
