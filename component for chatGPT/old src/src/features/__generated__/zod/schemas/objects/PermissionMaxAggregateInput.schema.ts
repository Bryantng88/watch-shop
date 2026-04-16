import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  description: z.literal(true).optional()
}).strict();
export const PermissionMaxAggregateInputObjectSchema: z.ZodType<Prisma.PermissionMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PermissionMaxAggregateInputType>;
export const PermissionMaxAggregateInputObjectZodSchema = makeSchema();
