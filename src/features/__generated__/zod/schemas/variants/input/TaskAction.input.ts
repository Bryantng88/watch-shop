import * as z from 'zod';

import { TaskCompletionModeSchema } from '../../enums/TaskCompletionMode.schema';
import { TaskExecutionTargetTypeSchema } from '../../enums/TaskExecutionTargetType.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
// prettier-ignore
export const TaskActionInputSchema = z.object({
    id: z.string(),
    taskTypeId: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    completionMode: TaskCompletionModeSchema,
    completionRuleKey: z.string().optional().nullable(),
    targetType: TaskExecutionTargetTypeSchema.optional().nullable(),
    serviceCatalogId: z.string().optional().nullable(),
    technicalDetailCatalogId: z.string().optional().nullable(),
    supplyCatalogId: z.string().optional().nullable(),
    mechanicalPartCatalogId: z.string().optional().nullable(),
    technicalActionMode: TechnicalActionModeSchema.optional().nullable(),
    defaultTitleTemplate: z.string().optional().nullable(),
    defaultDescriptionTemplate: z.string().optional().nullable(),
    metadataJson: z.unknown().optional().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    taskType: z.unknown(),
    tasks: z.array(z.unknown()),
    serviceCatalog: z.unknown().optional().nullable(),
    technicalDetailCatalog: z.unknown().optional().nullable(),
    supplyCatalog: z.unknown().optional().nullable(),
    mechanicalPartCatalog: z.unknown().optional().nullable()
}).strict();

export type TaskActionInputType = z.infer<typeof TaskActionInputSchema>;
