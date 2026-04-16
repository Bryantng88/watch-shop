import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  description: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const PermissionCountAggregateInputObjectSchema: z.ZodType<Prisma.PermissionCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCountAggregateInputType>;
export const PermissionCountAggregateInputObjectZodSchema = makeSchema();
