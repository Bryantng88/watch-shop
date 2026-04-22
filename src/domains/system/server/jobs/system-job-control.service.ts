import { prisma } from "@/server/db/client";

const DEFAULT_BATCH_SIZE = 3;
const ACQUISITION_SPEC_KEY = "acquisition_spec";

async function ensureDefaultControl() {
    await prisma.systemJobControl.upsert({
        where: { key: ACQUISITION_SPEC_KEY },
        update: {},
        create: {
            key: ACQUISITION_SPEC_KEY,
            label: "Acquisition AI Spec",
            enabled: true,
            batchSize: DEFAULT_BATCH_SIZE,
            pausedReason: null,
        },
    });
}

export async function getSystemJobControlsOverview() {
    await ensureDefaultControl();

    const controls = await prisma.systemJobControl.findMany({
        orderBy: { label: "asc" },
    });

    const [pending, failed] = await Promise.all([
        prisma.acquisitionSpecJob.count({
            where: { status: "PENDING" },
        }),
        prisma.acquisitionSpecJob.count({
            where: { status: "FAILED" },
        }),
    ]);

    return {
        controls: controls.map((item) => ({
            ...item,
            batchSize:
                typeof item.batchSize === "number" && item.batchSize > 0
                    ? item.batchSize
                    : DEFAULT_BATCH_SIZE,
        })),
        stats: {
            acquisitionSpec: {
                pending,
                failed,
            },
        },
    };
}

export async function getSystemJobControlDetail(key: string) {
    await ensureDefaultControl();
    const item = await prisma.systemJobControl.findUnique({
        where: { key },
    });

    if (!item) return null;

    return {
        ...item,
        batchSize:
            typeof item.batchSize === "number" && item.batchSize > 0
                ? item.batchSize
                : DEFAULT_BATCH_SIZE,
    };
}

export async function updateSystemJobControl(
    key: string,
    input: {
        enabled?: boolean;
        batchSize?: number;
        pausedReason?: string | null;
        metadata?: any;
        updatedBy?: string | null;
    }
) {
    await ensureDefaultControl();

    return prisma.systemJobControl.update({
        where: { key },
        data: {
            ...(typeof input.enabled === "boolean"
                ? { enabled: input.enabled }
                : {}),
            ...(typeof input.batchSize === "number"
                ? { batchSize: Math.max(1, Math.min(10, Math.round(input.batchSize))) }
                : {}),
            ...(input.pausedReason !== undefined
                ? { pausedReason: input.pausedReason }
                : {}),
            ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
            updatedBy: input.updatedBy ?? undefined,
        },
    });
}