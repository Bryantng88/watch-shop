import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PermissionIncludeObjectSchema as PermissionIncludeObjectSchema } from './objects/PermissionInclude.schema';
import { PermissionOrderByWithRelationInputObjectSchema as PermissionOrderByWithRelationInputObjectSchema } from './objects/PermissionOrderByWithRelationInput.schema';
import { PermissionWhereInputObjectSchema as PermissionWhereInputObjectSchema } from './objects/PermissionWhereInput.schema';
import { PermissionWhereUniqueInputObjectSchema as PermissionWhereUniqueInputObjectSchema } from './objects/PermissionWhereUniqueInput.schema';
import { PermissionScalarFieldEnumSchema } from './enums/PermissionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PermissionFindFirstSelectSchema: z.ZodType<Prisma.PermissionSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    description: z.boolean().optional(),
    roles: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PermissionSelect>;

export const PermissionFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    description: z.boolean().optional(),
    roles: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const PermissionFindFirstSchema: z.ZodType<Prisma.PermissionFindFirstArgs> = z.object({ select: PermissionFindFirstSelectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), orderBy: z.union([PermissionOrderByWithRelationInputObjectSchema, PermissionOrderByWithRelationInputObjectSchema.array()]).optional(), where: PermissionWhereInputObjectSchema.optional(), cursor: PermissionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PermissionScalarFieldEnumSchema, PermissionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PermissionFindFirstArgs>;

export const PermissionFindFirstZodSchema = z.object({ select: PermissionFindFirstSelectSchema.optional(), include: PermissionIncludeObjectSchema.optional(), orderBy: z.union([PermissionOrderByWithRelationInputObjectSchema, PermissionOrderByWithRelationInputObjectSchema.array()]).optional(), where: PermissionWhereInputObjectSchema.optional(), cursor: PermissionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PermissionScalarFieldEnumSchema, PermissionScalarFieldEnumSchema.array()]).optional() }).strict();