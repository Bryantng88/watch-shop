import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './objects/WorkCaseActivityInclude.schema';
import { WorkCaseActivityOrderByWithRelationInputObjectSchema as WorkCaseActivityOrderByWithRelationInputObjectSchema } from './objects/WorkCaseActivityOrderByWithRelationInput.schema';
import { WorkCaseActivityWhereInputObjectSchema as WorkCaseActivityWhereInputObjectSchema } from './objects/WorkCaseActivityWhereInput.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './objects/WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityScalarFieldEnumSchema } from './enums/WorkCaseActivityScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkCaseActivityFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WorkCaseActivitySelect> = z.object({
    id: z.boolean().optional(),
    workCaseId: z.boolean().optional(),
    actorId: z.boolean().optional(),
    action: z.boolean().optional(),
    note: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    workCase: z.boolean().optional(),
    actor: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivitySelect>;

export const WorkCaseActivityFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    workCaseId: z.boolean().optional(),
    actorId: z.boolean().optional(),
    action: z.boolean().optional(),
    note: z.boolean().optional(),
    metadata: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    workCase: z.boolean().optional(),
    actor: z.boolean().optional()
  }).strict();

export const WorkCaseActivityFindFirstOrThrowSchema: z.ZodType<Prisma.WorkCaseActivityFindFirstOrThrowArgs> = z.object({ select: WorkCaseActivityFindFirstOrThrowSelectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), orderBy: z.union([WorkCaseActivityOrderByWithRelationInputObjectSchema, WorkCaseActivityOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseActivityWhereInputObjectSchema.optional(), cursor: WorkCaseActivityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkCaseActivityScalarFieldEnumSchema, WorkCaseActivityScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityFindFirstOrThrowArgs>;

export const WorkCaseActivityFindFirstOrThrowZodSchema = z.object({ select: WorkCaseActivityFindFirstOrThrowSelectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), orderBy: z.union([WorkCaseActivityOrderByWithRelationInputObjectSchema, WorkCaseActivityOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseActivityWhereInputObjectSchema.optional(), cursor: WorkCaseActivityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkCaseActivityScalarFieldEnumSchema, WorkCaseActivityScalarFieldEnumSchema.array()]).optional() }).strict();