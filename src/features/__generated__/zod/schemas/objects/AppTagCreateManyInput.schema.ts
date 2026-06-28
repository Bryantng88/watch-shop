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
  updatedAt: z.coerce.date().optional(),
  workflowTemplateId: z.string().optional().nullable()
}).strict();
export const AppTagCreateManyInputObjectSchema: z.ZodType<Prisma.AppTagCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateManyInput>;
export const AppTagCreateManyInputObjectZodSchema = makeSchema();
