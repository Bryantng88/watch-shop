import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional()
}).strict();
export const RoleMaxAggregateInputObjectSchema: z.ZodType<Prisma.RoleMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RoleMaxAggregateInputType>;
export const RoleMaxAggregateInputObjectZodSchema = makeSchema();
