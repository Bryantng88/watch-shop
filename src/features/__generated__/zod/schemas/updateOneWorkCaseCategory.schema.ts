import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './objects/WorkCaseCategoryInclude.schema';
import { WorkCaseCategoryUpdateInputObjectSchema as WorkCaseCategoryUpdateInputObjectSchema } from './objects/WorkCaseCategoryUpdateInput.schema';
import { WorkCaseCategoryUncheckedUpdateInputObjectSchema as WorkCaseCategoryUncheckedUpdateInputObjectSchema } from './objects/WorkCaseCategoryUncheckedUpdateInput.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './objects/WorkCaseCategoryWhereUniqueInput.schema';

export const WorkCaseCategoryUpdateOneSchema: z.ZodType<Prisma.WorkCaseCategoryUpdateArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), data: z.union([WorkCaseCategoryUpdateInputObjectSchema, WorkCaseCategoryUncheckedUpdateInputObjectSchema]), where: WorkCaseCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpdateArgs>;

export const WorkCaseCategoryUpdateOneZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), data: z.union([WorkCaseCategoryUpdateInputObjectSchema, WorkCaseCategoryUncheckedUpdateInputObjectSchema]), where: WorkCaseCategoryWhereUniqueInputObjectSchema }).strict();