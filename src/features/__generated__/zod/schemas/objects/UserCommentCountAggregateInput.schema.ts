import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  body: z.literal(true).optional(),
  visibility: z.literal(true).optional(),
  metadataJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const UserCommentCountAggregateInputObjectSchema: z.ZodType<Prisma.UserCommentCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.UserCommentCountAggregateInputType>;
export const UserCommentCountAggregateInputObjectZodSchema = makeSchema();
