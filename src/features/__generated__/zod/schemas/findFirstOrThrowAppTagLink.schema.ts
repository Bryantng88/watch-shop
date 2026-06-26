import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagLinkIncludeObjectSchema as AppTagLinkIncludeObjectSchema } from './objects/AppTagLinkInclude.schema';
import { AppTagLinkOrderByWithRelationInputObjectSchema as AppTagLinkOrderByWithRelationInputObjectSchema } from './objects/AppTagLinkOrderByWithRelationInput.schema';
import { AppTagLinkWhereInputObjectSchema as AppTagLinkWhereInputObjectSchema } from './objects/AppTagLinkWhereInput.schema';
import { AppTagLinkWhereUniqueInputObjectSchema as AppTagLinkWhereUniqueInputObjectSchema } from './objects/AppTagLinkWhereUniqueInput.schema';
import { AppTagLinkScalarFieldEnumSchema } from './enums/AppTagLinkScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AppTagLinkFindFirstOrThrowSelectSchema: z.ZodType<Prisma.AppTagLinkSelect> = z.object({
    id: z.boolean().optional(),
    tagId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    tag: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AppTagLinkSelect>;

export const AppTagLinkFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    tagId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    targetId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    tag: z.boolean().optional()
  }).strict();

export const AppTagLinkFindFirstOrThrowSchema: z.ZodType<Prisma.AppTagLinkFindFirstOrThrowArgs> = z.object({ select: AppTagLinkFindFirstOrThrowSelectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), orderBy: z.union([AppTagLinkOrderByWithRelationInputObjectSchema, AppTagLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagLinkWhereInputObjectSchema.optional(), cursor: AppTagLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AppTagLinkScalarFieldEnumSchema, AppTagLinkScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AppTagLinkFindFirstOrThrowArgs>;

export const AppTagLinkFindFirstOrThrowZodSchema = z.object({ select: AppTagLinkFindFirstOrThrowSelectSchema.optional(), include: AppTagLinkIncludeObjectSchema.optional(), orderBy: z.union([AppTagLinkOrderByWithRelationInputObjectSchema, AppTagLinkOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagLinkWhereInputObjectSchema.optional(), cursor: AppTagLinkWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AppTagLinkScalarFieldEnumSchema, AppTagLinkScalarFieldEnumSchema.array()]).optional() }).strict();