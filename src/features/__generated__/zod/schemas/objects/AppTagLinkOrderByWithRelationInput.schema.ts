import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AppTagOrderByWithRelationInputObjectSchema as AppTagOrderByWithRelationInputObjectSchema } from './AppTagOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  tagId: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  tag: z.lazy(() => AppTagOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const AppTagLinkOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AppTagLinkOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkOrderByWithRelationInput>;
export const AppTagLinkOrderByWithRelationInputObjectZodSchema = makeSchema();
