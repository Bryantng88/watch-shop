import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './objects/WorkCaseActivityInclude.schema';
import { WorkCaseActivityUpdateInputObjectSchema as WorkCaseActivityUpdateInputObjectSchema } from './objects/WorkCaseActivityUpdateInput.schema';
import { WorkCaseActivityUncheckedUpdateInputObjectSchema as WorkCaseActivityUncheckedUpdateInputObjectSchema } from './objects/WorkCaseActivityUncheckedUpdateInput.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './objects/WorkCaseActivityWhereUniqueInput.schema';

export const WorkCaseActivityUpdateOneSchema: z.ZodType<Prisma.WorkCaseActivityUpdateArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), data: z.union([WorkCaseActivityUpdateInputObjectSchema, WorkCaseActivityUncheckedUpdateInputObjectSchema]), where: WorkCaseActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateArgs>;

export const WorkCaseActivityUpdateOneZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), data: z.union([WorkCaseActivityUpdateInputObjectSchema, WorkCaseActivityUncheckedUpdateInputObjectSchema]), where: WorkCaseActivityWhereUniqueInputObjectSchema }).strict();