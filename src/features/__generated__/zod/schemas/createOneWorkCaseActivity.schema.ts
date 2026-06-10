import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './objects/WorkCaseActivityInclude.schema';
import { WorkCaseActivityCreateInputObjectSchema as WorkCaseActivityCreateInputObjectSchema } from './objects/WorkCaseActivityCreateInput.schema';
import { WorkCaseActivityUncheckedCreateInputObjectSchema as WorkCaseActivityUncheckedCreateInputObjectSchema } from './objects/WorkCaseActivityUncheckedCreateInput.schema';

export const WorkCaseActivityCreateOneSchema: z.ZodType<Prisma.WorkCaseActivityCreateArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), data: z.union([WorkCaseActivityCreateInputObjectSchema, WorkCaseActivityUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateArgs>;

export const WorkCaseActivityCreateOneZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), data: z.union([WorkCaseActivityCreateInputObjectSchema, WorkCaseActivityUncheckedCreateInputObjectSchema]) }).strict();