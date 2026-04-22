import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogOrderByWithRelationInputObjectSchema as SystemJobRunLogOrderByWithRelationInputObjectSchema } from './objects/SystemJobRunLogOrderByWithRelationInput.schema';
import { SystemJobRunLogWhereInputObjectSchema as SystemJobRunLogWhereInputObjectSchema } from './objects/SystemJobRunLogWhereInput.schema';
import { SystemJobRunLogWhereUniqueInputObjectSchema as SystemJobRunLogWhereUniqueInputObjectSchema } from './objects/SystemJobRunLogWhereUniqueInput.schema';
import { SystemJobRunLogScalarFieldEnumSchema } from './enums/SystemJobRunLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SystemJobRunLogFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SystemJobRunLogSelect> = z.object({
    id: z.boolean().optional(),
    processorKey: z.boolean().optional(),
    triggerSource: z.boolean().optional(),
    status: z.boolean().optional(),
    processedCount: z.boolean().optional(),
    errorCount: z.boolean().optional(),
    note: z.boolean().optional(),
    detail: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    finishedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogSelect>;

export const SystemJobRunLogFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    processorKey: z.boolean().optional(),
    triggerSource: z.boolean().optional(),
    status: z.boolean().optional(),
    processedCount: z.boolean().optional(),
    errorCount: z.boolean().optional(),
    note: z.boolean().optional(),
    detail: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    finishedAt: z.boolean().optional()
  }).strict();

export const SystemJobRunLogFindFirstOrThrowSchema: z.ZodType<Prisma.SystemJobRunLogFindFirstOrThrowArgs> = z.object({ select: SystemJobRunLogFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([SystemJobRunLogOrderByWithRelationInputObjectSchema, SystemJobRunLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobRunLogWhereInputObjectSchema.optional(), cursor: SystemJobRunLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobRunLogScalarFieldEnumSchema, SystemJobRunLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogFindFirstOrThrowArgs>;

export const SystemJobRunLogFindFirstOrThrowZodSchema = z.object({ select: SystemJobRunLogFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([SystemJobRunLogOrderByWithRelationInputObjectSchema, SystemJobRunLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemJobRunLogWhereInputObjectSchema.optional(), cursor: SystemJobRunLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemJobRunLogScalarFieldEnumSchema, SystemJobRunLogScalarFieldEnumSchema.array()]).optional() }).strict();