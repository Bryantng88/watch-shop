import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './objects/WorkCaseCategoryInclude.schema';
import { WorkCaseCategoryOrderByWithRelationInputObjectSchema as WorkCaseCategoryOrderByWithRelationInputObjectSchema } from './objects/WorkCaseCategoryOrderByWithRelationInput.schema';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './objects/WorkCaseCategoryWhereInput.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './objects/WorkCaseCategoryWhereUniqueInput.schema';
import { WorkCaseCategoryScalarFieldEnumSchema } from './enums/WorkCaseCategoryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WorkCaseCategoryFindManySelectSchema: z.ZodType<Prisma.WorkCaseCategorySelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    scope: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workCases: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategorySelect>;

export const WorkCaseCategoryFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    scope: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    workCases: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const WorkCaseCategoryFindManySchema: z.ZodType<Prisma.WorkCaseCategoryFindManyArgs> = z.object({ select: WorkCaseCategoryFindManySelectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), orderBy: z.union([WorkCaseCategoryOrderByWithRelationInputObjectSchema, WorkCaseCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseCategoryWhereInputObjectSchema.optional(), cursor: WorkCaseCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkCaseCategoryScalarFieldEnumSchema, WorkCaseCategoryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryFindManyArgs>;

export const WorkCaseCategoryFindManyZodSchema = z.object({ select: WorkCaseCategoryFindManySelectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), orderBy: z.union([WorkCaseCategoryOrderByWithRelationInputObjectSchema, WorkCaseCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: WorkCaseCategoryWhereInputObjectSchema.optional(), cursor: WorkCaseCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WorkCaseCategoryScalarFieldEnumSchema, WorkCaseCategoryScalarFieldEnumSchema.array()]).optional() }).strict();