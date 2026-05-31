import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  platform: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const PostTargetCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.PostTargetCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetCreateWithoutProductsInput>;
export const PostTargetCreateWithoutProductsInputObjectZodSchema = makeSchema();
