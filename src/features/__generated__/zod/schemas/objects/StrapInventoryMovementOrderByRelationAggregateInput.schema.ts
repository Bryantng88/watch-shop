import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const StrapInventoryMovementOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementOrderByRelationAggregateInput>;
export const StrapInventoryMovementOrderByRelationAggregateInputObjectZodSchema = makeSchema();
