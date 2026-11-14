const { test } = require("node:test");
const assert = require("node:assert/strict");
const esbuild = require("esbuild");
const vm = require("node:vm");
async function fixture(options = {}) {
  const state = {
    permission: [],
    events: [],
    writes: [],
    refresh: [],
    denied: options.denied ?? false,
    issue: {
      updatedAt: new Date("2026-11-14T01:00:00Z"),
      executionStatus: "IN_PROGRESS",
      isConfirmed: true,
      area: "MOVEMENT",
      ...options.issue,
    },
  };
  const bundled = await esbuild.build({
    stdin: {
      contents: `export * from './src/domains/service/server/technician/technician-workspace.actions';export * from './src/domains/service/server/technician/technician-workspace.query';export * from './src/domains/service/shared/technician-workspace';`,
      loader: "ts",
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    write: false,
    plugins: [
      {
        name: "boundaries",
        setup(build) {
          build.onResolve(
            {
              filter:
                /^(next\/server|next\/cache|@\/server\/db\/client|@\/server\/auth\/requirePermission|\.\.\/issue-board)$/,
            },
            (args) => ({ path: args.path, namespace: "boundaries" }),
          );
          build.onLoad({ filter: /.*/, namespace: "boundaries" }, (args) => ({
            contents:
              args.path === "next/server"
                ? 'export const after=(work)=>globalThis.__state.events.push("deferred");'
                : args.path === "next/cache"
                  ? "export const revalidatePath=path=>globalThis.__state.refresh.push(path);"
                  : args.path.includes("requirePermission")
                    ? 'export async function requirePermission(permission){globalThis.__state.permission.push(permission);if(globalThis.__state.denied)throw Error("denied");return {id:"trusted-actor",name:"Technician",roles:["TECHNICIAN"],permissions:["SERVICE_VIEW","SERVICE_UPDATE"]}}'
                    : args.path.includes("db/client")
                      ? `const tx={async $queryRaw(){globalThis.__state.events.push('lock')},technicalIssue:{async findUnique(){globalThis.__state.events.push('read');return globalThis.__state.issue},async count(args){globalThis.__state.events.push(args);return 0},async findMany(args){globalThis.__state.events.push(args);return []}},technicalDetailCatalog:{async findFirst(){return {area:'MOVEMENT'}},async findMany(){return []}},vendor:{async findMany(){return []}}};export const prisma={...tx,async $transaction(fn){globalThis.__state.events.push('transaction');return fn(tx)}};`
                      : `async function write(name,input,tx){if(!tx)throw Error('missing transaction');globalThis.__state.writes.push({name,input});globalThis.__state.issue={...globalThis.__state.issue,executionStatus:name==='complete'?'DONE':name==='start'?'IN_PROGRESS':name==='confirm'?'CONFIRMED':globalThis.__state.issue.executionStatus,updatedAt:new Date('2026-11-14T02:00:00Z')};}export const confirmTechnicalIssue=(i,t)=>write('confirm',i,t);export const startTechnicalIssue=(i,t)=>write('start',i,t);export const completeTechnicalIssue=(i,t)=>write('complete',i,t);export const updateTechnicalIssue=(i,t)=>write('note',i,t);`,
          }));
        },
      },
    ],
  });
  const module = { exports: {} };
  vm.runInNewContext(bundled.outputFiles[0].text, {
    module,
    exports: module.exports,
    require,
    Date,
    URLSearchParams,
    __state: state,
  });
  return { state, api: module.exports };
}
const command = {
  id: "fixture",
  version: "2026-11-14T01:00:00.000Z",
  action: "complete",
  actualCost: 750000,
  resolutionNote: "Đã bảo dưỡng",
};
test("permission denial and malformed commands have no reads/writes", async () => {
  const denied = await fixture({ denied: true });
  await assert.rejects(denied.api.updateTechnicianIssue(command), /denied/);
  assert.deepEqual(denied.state.events, []);
  assert.deepEqual(denied.state.writes, []);
  const malformed = await fixture();
  assert.equal(
    (
      await malformed.api.updateTechnicianIssue({
        ...command,
        actorId: "forged",
      })
    ).ok,
    false,
  );
  assert.equal(
    (await malformed.api.updateTechnicianIssue({ ...command, actualCost: -1 }))
      .ok,
    false,
  );
  assert.deepEqual(malformed.state.events, []);
});
test("locked completion uses authenticated actor and original amount, and cannot replay", async () => {
  const { api, state } = await fixture();
  assert.equal((await api.updateTechnicianIssue(command)).ok, true);
  assert.deepEqual(state.events.slice(0, 3), ["transaction", "lock", "read"]);
  assert.equal(state.writes[0].input.actorId, "trusted-actor");
  assert.equal(state.writes[0].input.actualCost, 750000);
  assert.equal((await api.updateTechnicianIssue(command)).ok, false);
  assert.equal(state.writes.length, 1);
  assert.ok(state.refresh.includes("/admin/services/technician"));
});
test("stale, ended and invalid-stage commands do not call lifecycle writes", async () => {
  for (const issue of [
    { updatedAt: new Date("2026-11-14T02:00:00Z") },
    { executionStatus: "CANCELED" },
    { executionStatus: "DONE" },
    { executionStatus: "OPEN", isConfirmed: false },
  ]) {
    const { api, state } = await fixture({ issue });
    assert.equal((await api.updateTechnicianIssue(command)).ok, false);
    assert.equal(state.writes.length, 0);
  }
});
test("start passes mandatory technical inputs in transaction; note cannot overwrite other fields", async () => {
  const { api, state } = await fixture({
    issue: { executionStatus: "CONFIRMED" },
  });
  assert.equal(
    (
      await api.updateTechnicianIssue({
        id: command.id,
        version: command.version,
        action: "start",
        technicalDetailCatalogId: "catalog",
        expectedWorkingDays: 3,
        actionMode: "INTERNAL",
        vendorId: null,
        replacementPartCodes: [],
        startedNote: "Kiểm tra",
      })
    ).ok,
    true,
  );
  assert.equal(state.writes[0].input.expectedWorkingDays, 3);
  assert.equal(state.writes[0].input.technicalArea, "MOVEMENT");
  const note = await fixture();
  assert.equal(
    (
      await note.api.updateTechnicianIssue({
        id: command.id,
        version: command.version,
        action: "note",
        note: "Ghi chú mới",
      })
    ).ok,
    true,
  );
  assert.equal(note.state.writes[0].input.vendorId, undefined);
  assert.equal(note.state.writes[0].input.note, "Ghi chú mới");
});
test("all-issue workspace keeps server pagination bounded and has no technician ownership restriction", async () => {
  const { api, state } = await fixture();
  const parsed = api.technicianSearch({
    view: "ALL",
    page: "999999999999",
    q: "a".repeat(200),
  });
  assert.equal(parsed.q.length, 150);
  assert.equal(parsed.page, 10000);
  const result = await api.getTechnicianWorkspace({
    q: "Seiko",
    view: "ALL",
    page: 50,
  });
  assert.equal(result.page, 1);
  assert.equal(result.canUpdate, true);
  assert.equal(state.permission[0], "SERVICE_VIEW");
  const query = state.events.find(
    (event) => event && typeof event === "object" && event.take,
  );
  assert.equal(query.take, 25);
  assert.equal(query.skip, 0);
  assert.ok(!JSON.stringify(query.where).includes("technicianId"));
  assert.ok(JSON.stringify(query.where).includes("Seiko"));
});
