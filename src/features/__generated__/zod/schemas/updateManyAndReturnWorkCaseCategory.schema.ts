import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCategorySelectObjectSchema as WorkCaseCategorySelectObjectSchema } from './objects/WorkCaseCategorySelect.schema';
import { WorkCaseCategoryUpdateManyMutationInputObjectSchema as WorkCaseCategoryUpdateManyMutationInputObjectSchema } from './objects/WorkCaseCategoryUpdateManyMutationInput.schema';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './objects/WorkCaseCategoryWhereInput.schema';

export const WorkCaseCategoryUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkCaseCategoryUpdateManyAndReturnArgs> = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), data: WorkCaseCategoryUpdateManyMutationInputObjectSchema, where: WorkCaseCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCategoryUpdateManyAndReturnArgs>;

export const WorkCaseCategoryUpdateManyAndReturnZodSchema = z.object({ select: WorkCaseCategorySelectObjectSchema.optional(), data: WorkCaseCategoryUpdateManyMutationInputObjectSchema, where: WorkCaseCategoryWhereInputObjectSchema.optional() }).strict();