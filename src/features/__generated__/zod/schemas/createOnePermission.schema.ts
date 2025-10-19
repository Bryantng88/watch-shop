import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PermissionSelectObjectSchema as PermissionSelectObjectSchema } from './objects/PermissionSelect.schema';
import { PermissionIncludeObjectSchema as PermissionIncludeObjectSchema } from './objects/PermissionInclude.schema';
import { PermissionCreateInputObjectSchema as PermissionCreateInputObjectSchema } from './objects/PermissionCreateInput.schema';
import { PermissionUncheckedCreateInputObjectSchema as PermissionUncheckedCreateInputObjectSchema } from './objects/PermissionUncheckedCreateInput.schema';

export const PermissionCreateOneSchema: z.ZodType<Prisma.PermissionCreateArgs> = z.object({ select: PermissionSelectObjectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), data: z.union([PermissionCreateInputObjectSchema, PermissionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PermissionCreateArgs>;

export const PermissionCreateOneZodSchema = z.object({ select: PermissionSelectObjectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), data: z.union([PermissionCreateInputObjectSchema, PermissionUncheckedCreateInputObjectSchema]) }).strict();