import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  body: z.boolean().optional(),
  visibility: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const UserCommentSelectObjectSchema: z.ZodType<Prisma.UserCommentSelect> = makeSchema() as unknown as z.ZodType<Prisma.UserCommentSelect>;
export const UserCommentSelectObjectZodSchema = makeSchema();
