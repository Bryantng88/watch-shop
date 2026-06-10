import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './objects/WorkCaseCategoryInclude.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './objects/WorkCaseCategoryWhereUniqueInput.schema';

export const WorkCaseCategoryFindUniqueSchema: z.ZodType<Prisma.WorkCaseCategoryFindUniqueArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), where: WorkCaseCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryFindUniqueArgs>;

export const WorkCaseCategoryFindUniqueZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), where: WorkCaseCategoryWhereUniqueInputObjectSchema }).strict();