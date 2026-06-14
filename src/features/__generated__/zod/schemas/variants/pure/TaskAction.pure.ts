import * as z from 'zod';

import { TaskCompletionModeSchema } from '../../enums/TaskCompletionMode.schema';
import { TaskExecutionTargetTypeSchema } from '../../enums/TaskExecutionTargetType.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
// prettier-ignore
export const TaskActionModelSchema = z.object({
    id: z.string(),
    taskTypeId: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    completionMode: TaskCompletionModeSchema,
    completionRuleKey: z.string().nullable(),
    targetType: TaskExecutionTargetTypeSchema.nullable(),
    serviceCatalogId: z.string().nullable(),
    technicalDetailCatalogId: z.string().nullable(),
    supplyCatalogId: z.string().nullable(),
    mechanicalPartCatalogId: z.string().nullable(),
    technicalActionMode: TechnicalActionModeSchema.nullable(),
    defaultTitleTemplate: z.string().nullable(),
    defaultDescriptionTemplate: z.string().nullable(),
    metadataJson: z.unknown().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    taskType: z.unknown(),
    tasks: z.array(z.unknown()),
    serviceCatalog: z.unknown().nullable(),
    technicalDetailCatalog: z.unknown().nullable(),
    supplyCatalog: z.unknown().nullable(),
    mechanicalPartCatalog: z.unknown().nullable()
}).strict();

export type TaskActionPureType = z.infer<typeof TaskActionModelSchema>;
