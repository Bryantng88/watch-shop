import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityIncludeObjectSchema as WorkCaseActivityIncludeObjectSchema } from './objects/WorkCaseActivityInclude.schema';
import { WorkCaseActivityWhereUniqueInputObjectSchema as WorkCaseActivityWhereUniqueInputObjectSchema } from './objects/WorkCaseActivityWhereUniqueInput.schema';

export const WorkCaseActivityFindUniqueOrThrowSchema: z.ZodType<Prisma.WorkCaseActivityFindUniqueOrThrowArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), where: WorkCaseActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityFindUniqueOrThrowArgs>;

export const WorkCaseActivityFindUniqueOrThrowZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), include: WorkCaseActivityIncludeObjectSchema.optional(), where: WorkCaseActivityWhereUniqueInputObjectSchema }).strict();