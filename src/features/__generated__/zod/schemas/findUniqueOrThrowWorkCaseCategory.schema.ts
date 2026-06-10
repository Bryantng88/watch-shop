import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryIncludeObjectSchema as WorkCaseCategoryIncludeObjectSchema } from './objects/WorkCaseCategoryInclude.schema';
import { WorkCaseCategoryWhereUniqueInputObjectSchema as WorkCaseCategoryWhereUniqueInputObjectSchema } from './objects/WorkCaseCategoryWhereUniqueInput.schema';

export const WorkCaseCategoryFindUniqueOrThrowSchema: z.ZodType<Prisma.WorkCaseCategoryFindUniqueOrThrowArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), where: WorkCaseCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryFindUniqueOrThrowArgs>;

export const WorkCaseCategoryFindUniqueOrThrowZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), include: WorkCaseCategoryIncludeObjectSchema.optional(), where: WorkCaseCategoryWhereUniqueInputObjectSchema }).strict();