import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './objects/WorkCaseCategoryInclude.schema';
import { WorkCaseCategoryCreateInputObjectSchema as WorkCaseCategoryCreateInputObjectSchema } from './objects/WorkCaseCategoryCreateInput.schema';
import { WorkCaseCategoryUncheckedCreateInputObjectSchema as WorkCaseCategoryUncheckedCreateInputObjectSchema } from './objects/WorkCaseCategoryUncheckedCreateInput.schema';

export const WorkCaseCategoryCreateOneSchema: z.ZodType<Prisma.WorkCaseCategoryCreateArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), data: z.union([WorkCaseCategoryCreateInputObjectSchema, WorkCaseCategoryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryCreateArgs>;

export const WorkCaseCategoryCreateOneZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), data: z.union([WorkCaseCategoryCreateInputObjectSchema, WorkCaseCategoryUncheckedCreateInputObjectSchema]) }).strict();