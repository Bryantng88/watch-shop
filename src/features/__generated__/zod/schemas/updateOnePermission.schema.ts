import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PermissionSelectObjectSchema as PermissionSelectObjectSchema } from './objects/PermissionSelect.schema';
import { PermissionIncludeObjectSchema as PermissionIncludeObjectSchema } from './objects/PermissionInclude.schema';
import { PermissionUpdateInputObjectSchema as PermissionUpdateInputObjectSchema } from './objects/PermissionUpdateInput.schema';
import { PermissionUncheckedUpdateInputObjectSchema as PermissionUncheckedUpdateInputObjectSchema } from './objects/PermissionUncheckedUpdateInput.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './objects/PermissionWhereUniqueInput.schema';

export const PermissionUpdateOneSchema: z.ZodType<Prisma.PermissionUpdateArgs> = z.object({ select: PermissionSelectObjectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), data: z.union([PermissionUpdateInputObjectSchema, PermissionUncheckedUpdateInputObjectSchema]), where: PermissionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PermissionUpdateArgs>;

export const PermissionUpdateOneZodSchema = z.object({ select: PermissionSelectObjectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), data: z.union([PermissionUpdateInputObjectSchema, PermissionUncheckedUpdateInputObjectSchema]), where: PermissionWhereUniqueInputObjectSchema }).strict();