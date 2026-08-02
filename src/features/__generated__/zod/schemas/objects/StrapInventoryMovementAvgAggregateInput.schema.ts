import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  balanceAfter: z.literal(true).optional()
}).strict();
export const StrapInventoryMovementAvgAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementAvgAggregateInputType>;
export const StrapInventoryMovementAvgAggregateInputObjectZodSchema = makeSchema();
