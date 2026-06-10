import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './objects/WorkCaseActivityInclude.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './objects/WorkCaseActivityWhereUniqueInput.schema';
import { WorkCaseActivityCreateInputObjectSchema as WorkCaseActivityCreateInputObjectSchema } from './objects/WorkCaseActivityCreateInput.schema';
import { WorkCaseActivityUncheckedCreateInputObjectSchema as WorkCaseActivityUncheckedCreateInputObjectSchema } from './objects/WorkCaseActivityUncheckedCreateInput.schema';
import { WorkCaseActivityUpdateInputObjectSchema as WorkCaseActivityUpdateInputObjectSchema } from './objects/WorkCaseActivityUpdateInput.schema';
import { WorkCaseActivityUncheckedUpdateInputObjectSchema as WorkCaseActivityUncheckedUpdateInputObjectSchema } from './objects/WorkCaseActivityUncheckedUpdateInput.schema';

export const WorkCaseActivityUpsertOneSchema: z.ZodType<Prisma.WorkCaseActivityUpsertArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), where: WorkCaseActivityWhereUniqueInputObjectSchema, create: z.union([ WorkCaseActivityCreateInputObjectSchema, WorkCaseActivityUncheckedCreateInputObjectSchema ]), update: z.union([ WorkCaseActivityUpdateInputObjectSchema, WorkCaseActivityUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityUpsertArgs>;

export const WorkCaseActivityUpsertOneZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), where: WorkCaseActivityWhereUniqueInputObjectSchema, create: z.union([ WorkCaseActivityCreateInputObjectSchema, WorkCaseActivityUncheckedCreateInputObjectSchema ]), update: z.union([ WorkCaseActivityUpdateInputObjectSchema, WorkCaseActivityUncheckedUpdateInputObjectSchema ]) }).strict();