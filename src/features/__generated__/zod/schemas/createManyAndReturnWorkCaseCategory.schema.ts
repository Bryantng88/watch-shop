import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryCreateManyInputObjectSchema as WorkCaseCategoryCreateManyInputObjectSchema } from './objects/WorkCaseCategoryCreateManyInput.schema';

export const WorkCaseCategoryCreateManyAndReturnSchema: z.ZodType<Prisma.WorkCaseCategoryCreateManyAndReturnArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), data: z.union([ WorkCaseCategoryCreateManyInputObjectSchema, z.array(WorkCaseCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateManyAndReturnArgs>;

export const WorkCaseCategoryCreateManyAndReturnZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), data: z.union([ WorkCaseCategoryCreateManyInputObjectSchema, z.array(WorkCaseCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();