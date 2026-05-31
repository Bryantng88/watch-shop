import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  platform: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const PostTargetCountAggregateInputObjectSchema: z.ZodType<Prisma.PostTargetCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetCountAggregateInputType>;
export const PostTargetCountAggregateInputObjectZodSchema = makeSchema();
