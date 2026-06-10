import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './objects/WorkCaseCategoryInclude.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './objects/WorkCaseCategoryWhereUniqueInput.schema';
import { WorkCaseCategoryCreateInputObjectSchema as WorkCaseCategoryCreateInputObjectSchema } from './objects/WorkCaseCategoryCreateInput.schema';
import { WorkCaseCategoryUncheckedCreateInputObjectSchema as WorkCaseCategoryUncheckedCreateInputObjectSchema } from './objects/WorkCaseCategoryUncheckedCreateInput.schema';
import { WorkCaseCategoryUpdateInputObjectSchema as WorkCaseCategoryUpdateInputObjectSchema } from './objects/WorkCaseCategoryUpdateInput.schema';
import { WorkCaseCategoryUncheckedUpdateInputObjectSchema as WorkCaseCategoryUncheckedUpdateInputObjectSchema } from './objects/WorkCaseCategoryUncheckedUpdateInput.schema';

export const WorkCaseCategoryUpsertOneSchema: z.ZodType<Prisma.WorkCaseCategoryUpsertArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), where: WorkCaseCategoryWhereUniqueInputObjectSchema, create: z.union([ WorkCaseCategoryCreateInputObjectSchema, WorkCaseCategoryUncheckedCreateInputObjectSchema ]), update: z.union([ WorkCaseCategoryUpdateInputObjectSchema, WorkCaseCategoryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpsertArgs>;

export const WorkCaseCategoryUpsertOneZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), where: WorkCaseCategoryWhereUniqueInputObjectSchema, create: z.union([ WorkCaseCategoryCreateInputObjectSchema, WorkCaseCategoryUncheckedCreateInputObjectSchema ]), update: z.union([ WorkCaseCategoryUpdateInputObjectSchema, WorkCaseCategoryUncheckedUpdateInputObjectSchema ]) }).strict();