import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './objects/WorkCaseCategoryWhereInput.schema';

export const WorkCaseCategoryDeleteManySchema: z.ZodType<Prisma.WorkCaseCategoryDeleteManyArgs> = z.object({ where: WorkCaseCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryDeleteManyArgs>;

export const WorkCaseCategoryDeleteManyZodSchema = z.object({ where: WorkCaseCategoryWhereInputObjectSchema.optional() }).strict();