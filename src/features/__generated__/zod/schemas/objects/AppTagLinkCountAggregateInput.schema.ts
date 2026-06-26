import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  tagId: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const AppTagLinkCountAggregateInputObjectSchema: z.ZodType<Prisma.AppTagLinkCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCountAggregateInputType>;
export const AppTagLinkCountAggregateInputObjectZodSchema = makeSchema();
