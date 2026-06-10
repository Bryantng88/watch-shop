import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './objects/WorkCaseActivityInclude.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './objects/WorkCaseActivityWhereUniqueInput.schema';

export const WorkCaseActivityFindUniqueSchema: z.ZodType<Prisma.WorkCaseActivityFindUniqueArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), where: WorkCaseActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityFindUniqueArgs>;

export const WorkCaseActivityFindUniqueZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), where: WorkCaseActivityWhereUniqueInputObjectSchema }).strict();