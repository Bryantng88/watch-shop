import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  balanceAfter: z.literal(true).optional()
}).strict();
export const StrapInventoryMovementSumAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementSumAggregateInputType>;
export const StrapInventoryMovementSumAggregateInputObjectZodSchema = makeSchema();
