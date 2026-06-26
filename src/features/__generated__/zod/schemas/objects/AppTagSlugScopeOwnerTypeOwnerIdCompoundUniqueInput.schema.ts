import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema'

const makeSchema = () => z.object({
  slug: z.string(),
  scope: AppTagScopeSchema,
  ownerType: AppTagOwnerTypeSchema,
  ownerId: z.string()
}).strict();
export const AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInput>;
export const AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInputObjectZodSchema = makeSchema();
