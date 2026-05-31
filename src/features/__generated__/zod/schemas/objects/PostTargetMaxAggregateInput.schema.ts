import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  platform: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const PostTargetMaxAggregateInputObjectSchema: z.ZodType<Prisma.PostTargetMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetMaxAggregateInputType>;
export const PostTargetMaxAggregateInputObjectZodSchema = makeSchema();
