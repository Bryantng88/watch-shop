import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlOrderByWithRelationInputObjectSchema as SystemJobControlOrderByWithRelationInputObjectSchema } from './objects/SystemJobControlOrderByWithRelationInput.schema';
import { SystemJobControlWhereInputObjectSchema as SystemJobControlWhereInputObjectSchema } from './objects/SystemJobControlWhereInput.schema';
import { SystemJobControlWhereUniqueInputObjectSchema as SystemJobControlWhereUniqueInputObjectSchema } from './objects/SystemJobControlWhereUniqueInput.schema';
import { SystemJobControlScalarFieldEnumSchema } from './enums/SystemJobControlScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SystemJobControlFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SystemJobControlSelect> = z.object({
    key: z.boolean().optional(),
    label: z.boolean().optional(),
    enabled: z.boolean().optional(),
    batchSize: z.boolean().optional(),
    pausedReason: z.boolean().optional(),
    metadata: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    updatedBy: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SystemJobControlSelect>;

export const SystemJobControlFindFirstOrThrowSelectZodSchema = z.object({
    key: z.boolean().optional(),
    label: z.boolean().optional(),
    enabled: z.boolean().optional(),
    batchSize: z.boolean().optional(),
    pausedReason: z.boolean().optional(),
    metadata: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    updatedBy: z.boolean().optional()
  }).strict();

export const SystemJobControlFindFirstOrThrowSchema: z.ZodType<Prisma.SystemJobControlFindFirstOrThrowArgs> = z.object({ select: SystemJobControlFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([SystemJobControlOrderByWithRelationInputObjectSchema, SystemJobControlOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobControlWhereInputObjectSchema.optional(), cursor: SystemJobControlWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobControlScalarFieldEnumSchema, SystemJobControlScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlFindFirstOrThrowArgs>;

export const SystemJobControlFindFirstOrThrowZodSchema = z.object({ select: SystemJobControlFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([SystemJobControlOrderByWithRelationInputObjectSchema, SystemJobControlOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobControlWhereInputObjectSchema.optional(), cursor: SystemJobControlWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobControlScalarFieldEnumSchema, SystemJobControlScalarFieldEnumSchema.array()]).optional() }).strict();