import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PermissionSelectObjectSchema as PermissionSelectObjectSchema } from './objects/PermissionSelect.schema';
import { PermissionIncludeObjectSchema as PermissionIncludeObjectSchema } from './objects/PermissionInclude.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './objects/PermissionWhereUniqueInput.schema';

export const PermissionFindUniqueSchema: z.ZodType<Prisma.PermissionFindUniqueArgs> = z.object({ select: PermissionSelectObjectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), where: PermissionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PermissionFindUniqueArgs>;

export const PermissionFindUniqueZodSchema = z.object({ select: PermissionSelectObjectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), where: PermissionWhereUniqueInputObjectSchema }).strict();