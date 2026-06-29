import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  businessEventLogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ruleId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationDispatchOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.NotificationDispatchOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchOrderByWithRelationInput>;
export const NotificationDispatchOrderByWithRelationInputObjectZodSchema = makeSchema();
