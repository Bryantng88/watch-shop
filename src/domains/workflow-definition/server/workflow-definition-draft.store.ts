import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { WorkflowDefinitionDraft } from "./workflow-definition-draft.types";

type DraftStoreFile = {
  version: 1;
  drafts: WorkflowDefinitionDraft[];
};

const STORE_PATH = path.join(
  process.cwd(),
  ".data",
  "workflow-definition-drafts.json",
);

async function ensureStoreDir() {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
}

async function readStore(): Promise<DraftStoreFile> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as DraftStoreFile;

    return {
      version: 1,
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { version: 1, drafts: [] };
    }
    throw error;
  }
}

async function writeStore(store: DraftStoreFile) {
  await ensureStoreDir();
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function listWorkflowDefinitionDraftRecords() {
  const store = await readStore();
  return [...store.drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getWorkflowDefinitionDraftRecord(id: string) {
  const store = await readStore();
  return store.drafts.find((draft) => draft.id === id) ?? null;
}

export async function createWorkflowDefinitionDraftRecord(
  input: Omit<WorkflowDefinitionDraft, "id" | "createdAt" | "updatedAt">,
) {
  const store = await readStore();
  const now = new Date().toISOString();
  const draft: WorkflowDefinitionDraft = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  store.drafts.unshift(draft);
  await writeStore(store);

  return draft;
}

export async function updateWorkflowDefinitionDraftRecord(
  id: string,
  patch: Partial<Omit<WorkflowDefinitionDraft, "id" | "createdAt">>,
) {
  const store = await readStore();
  const index = store.drafts.findIndex((draft) => draft.id === id);
  if (index < 0) return null;

  const next: WorkflowDefinitionDraft = {
    ...store.drafts[index],
    ...patch,
    id,
    createdAt: store.drafts[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  store.drafts[index] = next;
  await writeStore(store);

  return next;
}
