import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInputObjectSchema as AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInputObjectSchema } from './AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  slug_scope_ownerType_ownerId: z.lazy(() => AppTagSlugScopeOwnerTypeOwnerIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const AppTagWhereUniqueInputObjectSchema: z.ZodType<Prisma.AppTagWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagWhereUniqueInput>;
export const AppTagWhereUniqueInputObjectZodSchema = makeSchema();
