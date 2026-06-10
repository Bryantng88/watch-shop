import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivityUpdateManyMutationInputObjectSchema as WorkCaseActivityUpdateManyMutationInputObjectSchema } from './objects/WorkCaseActivityUpdateManyMutationInput.schema';
import { WorkCaseActivityWhereInputObjectSchema as WorkCaseActivityWhereInputObjectSchema } from './objects/WorkCaseActivityWhereInput.schema';

export const WorkCaseActivityUpdateManySchema: z.ZodType<Prisma.WorkCaseActivityUpdateManyArgs> = z.object({ data: WorkCaseActivityUpdateManyMutationInputObjectSchema, where: WorkCaseActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateManyArgs>;

export const WorkCaseActivityUpdateManyZodSchema = z.object({ data: WorkCaseActivityUpdateManyMutationInputObjectSchema, where: WorkCaseActivityWhereInputObjectSchema.optional() }).strict();