import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategoryUpdateManyMutationInputObjectSchema as WorkCaseCategoryUpdateManyMutationInputObjectSchema } from './objects/WorkCaseCategoryUpdateManyMutationInput.schema';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './objects/WorkCaseCategoryWhereInput.schema';

export const WorkCaseCategoryUpdateManySchema: z.ZodType<Prisma.WorkCaseCategoryUpdateManyArgs> = z.object({ data: WorkCaseCategoryUpdateManyMutationInputObjectSchema, where: WorkCaseCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpdateManyArgs>;

export const WorkCaseCategoryUpdateManyZodSchema = z.object({ data: WorkCaseCategoryUpdateManyMutationInputObjectSchema, where: WorkCaseCategoryWhereInputObjectSchema.optional() }).strict();