import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategoryCreateManyInputObjectSchema as WorkCaseCategoryCreateManyInputObjectSchema } from './objects/WorkCaseCategoryCreateManyInput.schema';

export const WorkCaseCategoryCreateManySchema: z.ZodType<Prisma.WorkCaseCategoryCreateManyArgs> = z.object({ data: z.union([ WorkCaseCategoryCreateManyInputObjectSchema, z.array(WorkCaseCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateManyArgs>;

export const WorkCaseCategoryCreateManyZodSchema = z.object({ data: z.union([ WorkCaseCategoryCreateManyInputObjectSchema, z.array(WorkCaseCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();