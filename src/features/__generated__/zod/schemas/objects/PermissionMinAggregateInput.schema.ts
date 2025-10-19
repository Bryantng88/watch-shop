import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  description: z.literal(true).optional()
}).strict();
export const PermissionMinAggregateInputObjectSchema: z.ZodType<Prisma.PermissionMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PermissionMinAggregateInputType>;
export const PermissionMinAggregateInputObjectZodSchema = makeSchema();
