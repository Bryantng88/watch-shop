import * as z from 'zod';

// prettier-ignore
export const ProjectionRecordInputSchema = z.object({
    id: z.string(),
    projectionKey: z.string(),
    projectionVersion: z.number().int(),
    rowKey: z.string(),
    workspaceId: z.string().optional().nullable(),
    spaceId: z.string().optional().nullable(),
    entityType: z.string().optional().nullable(),
    entityId: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    searchText: z.string().optional().nullable(),
    sortAt: z.date().optional().nullable(),
    dataJson: z.unknown(),
    sourceUpdatedAt: z.date().optional().nullable(),
    projectedAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ProjectionRecordInputType = z.infer<typeof ProjectionRecordInputSchema>;
