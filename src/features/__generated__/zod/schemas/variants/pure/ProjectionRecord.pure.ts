import * as z from 'zod';

// prettier-ignore
export const ProjectionRecordModelSchema = z.object({
    id: z.string(),
    projectionKey: z.string(),
    projectionVersion: z.number().int(),
    rowKey: z.string(),
    workspaceId: z.string().nullable(),
    spaceId: z.string().nullable(),
    entityType: z.string().nullable(),
    entityId: z.string().nullable(),
    status: z.string().nullable(),
    searchText: z.string().nullable(),
    sortAt: z.date().nullable(),
    dataJson: z.unknown(),
    sourceUpdatedAt: z.date().nullable(),
    projectedAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ProjectionRecordPureType = z.infer<typeof ProjectionRecordModelSchema>;
