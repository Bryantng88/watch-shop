import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInputObjectSchema as MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInputObjectSchema } from './MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  mediaObjectId_ownerType_ownerId_role: z.lazy(() => MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInputObjectSchema).optional()
}).strict();
export const MediaBindingWhereUniqueInputObjectSchema: z.ZodType<Prisma.MediaBindingWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingWhereUniqueInput>;
export const MediaBindingWhereUniqueInputObjectZodSchema = makeSchema();
