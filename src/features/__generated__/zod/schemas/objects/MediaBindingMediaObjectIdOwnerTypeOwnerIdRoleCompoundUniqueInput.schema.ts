import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { MediaRoleSchema } from '../enums/MediaRole.schema'

const makeSchema = () => z.object({
  mediaObjectId: z.string(),
  ownerType: MediaOwnerTypeSchema,
  ownerId: z.string(),
  role: MediaRoleSchema
}).strict();
export const MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInputObjectSchema: z.ZodType<Prisma.MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInput>;
export const MediaBindingMediaObjectIdOwnerTypeOwnerIdRoleCompoundUniqueInputObjectZodSchema = makeSchema();
