import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivityWhereInputObjectSchema as WorkCaseActivityWhereInputObjectSchema } from './objects/WorkCaseActivityWhereInput.schema';

export const WorkCaseActivityDeleteManySchema: z.ZodType<Prisma.WorkCaseActivityDeleteManyArgs> = z.object({ where: WorkCaseActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityDeleteManyArgs>;

export const WorkCaseActivityDeleteManyZodSchema = z.object({ where: WorkCaseActivityWhereInputObjectSchema.optional() }).strict();