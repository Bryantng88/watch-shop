import assert from "node:assert/strict";import {test} from "node:test";import {customerAssistantReady} from "./server/access";
test("live assistant fails closed outside the exact staging target or isolated test database",()=>{const e={CUSTOMER_AI_ENABLED:"1",PERSONAL_CODEX_ENABLED:"1",PERSONAL_CODEX_ENVIRONMENT:"staging",PERSONAL_CODEX_WORKER_TOKEN:"t".repeat(32),DATABASE_URL:"postgresql://u:p@watch-shop-staging-db/watch_shop_storefront_staging",APP_URL:"https://admin-staging.vinticwatches.vn"};assert.equal(customerAssistantReady(e),true);for(const change of [{CUSTOMER_AI_ENABLED:"0"},{PERSONAL_CODEX_ENVIRONMENT:"production"},{DATABASE_URL:"postgresql://u:p@production-db/watch_shop_storefront_staging"},{APP_URL:"https://admin.vinticwatches.vn"}])assert.equal(customerAssistantReady({...e,...change}),false);assert.equal(customerAssistantReady({...e,DATABASE_URL:"postgresql://u:p@127.0.0.1/personal_codex_test",APP_URL:"http://127.0.0.1:3002"}),true);});
import { productionBenReady } from './server/access';

test('production pilot requires its own token and the exact configured database account', () => {
  const env = {
    CUSTOMER_AI_ENABLED: '1',
    BEN_CUSTOMER_ENVIRONMENT: 'production',
    BEN_CUSTOMER_WORKER_TOKEN: 'x'.repeat(40),
    CUSTOMER_AI_PERMISSION_CONTACT_USER_ID: 'long',
    BEN_PRODUCTION_DATABASE_USER: 'fixture-project-user',
    DATABASE_URL: 'postgresql://fixture-project-user:fixture@aws-1-ap-southeast-1.pooler.supabase.com/postgres',
    APP_URL: 'https://admin.vinticwatches.vn',
  };
  assert.equal(productionBenReady(env), true);
  for (const change of [
    { CUSTOMER_AI_PERMISSION_CONTACT_USER_ID: '' },
    { BEN_CUSTOMER_WORKER_TOKEN: '' },
    { PERSONAL_CODEX_WORKER_TOKEN: env.BEN_CUSTOMER_WORKER_TOKEN },
    { BEN_CODE_WORKER_TOKEN: env.BEN_CUSTOMER_WORKER_TOKEN },
    { BEN_PRODUCTION_DATABASE_USER: 'different-project' },
    { APP_URL: 'https://admin-staging.vinticwatches.vn' },
  ]) {
    assert.equal(customerAssistantReady({ ...env, ...change }), false);
  }
});
