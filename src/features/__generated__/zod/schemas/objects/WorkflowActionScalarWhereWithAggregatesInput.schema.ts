import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumWorkflowActionTypeWithAggregatesFilterObjectSchema as EnumWorkflowActionTypeWithAggregatesFilterObjectSchema } from './EnumWorkflowActionTypeWithAggregatesFilter.schema';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const workflowactionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowActionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkflowActionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowActionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowActionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkflowActionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  workflowId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  actionType: z.union([z.lazy(() => EnumWorkflowActionTypeWithAggregatesFilterObjectSchema), WorkflowActionTypeSchema]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  configJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkflowActionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WorkflowActionScalarWhereWithAggregatesInput> = workflowactionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WorkflowActionScalarWhereWithAggregatesInput>;
export const WorkflowActionScalarWhereWithAggregatesInputObjectZodSchema = workflowactionscalarwherewithaggregatesinputSchema;
