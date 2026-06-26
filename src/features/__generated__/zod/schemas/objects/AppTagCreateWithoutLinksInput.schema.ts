import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  color: z.string().optional().nullable(),
  scope: AppTagScopeSchema.optional(),
  ownerType: AppTagOwnerTypeSchema.optional().nullable(),
  ownerId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const AppTagCreateWithoutLinksInputObjectSchema: z.ZodType<Prisma.AppTagCreateWithoutLinksInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateWithoutLinksInput>;
export const AppTagCreateWithoutLinksInputObjectZodSchema = makeSchema();
