import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  cost: z.literal(true).optional()
}).strict();
export const MaintenanceLogsSumAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceLogsSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceLogsSumAggregateInputType>;
export const MaintenanceLogsSumAggregateInputObjectZodSchema = makeSchema();
