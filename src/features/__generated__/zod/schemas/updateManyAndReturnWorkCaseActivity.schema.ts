import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityUpdateManyMutationInputObjectSchema as WorkCaseActivityUpdateManyMutationInputObjectSchema } from './objects/WorkCaseActivityUpdateManyMutationInput.schema';
import { WorkCaseActivityWhereInputObjectSchema as WorkCaseActivityWhereInputObjectSchema } from './objects/WorkCaseActivityWhereInput.schema';

export const WorkCaseActivityUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkCaseActivityUpdateManyAndReturnArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), data: WorkCaseActivityUpdateManyMutationInputObjectSchema, where: WorkCaseActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityUpdateManyAndReturnArgs>;

export const WorkCaseActivityUpdateManyAndReturnZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), data: WorkCaseActivityUpdateManyMutationInputObjectSchema, where: WorkCaseActivityWhereInputObjectSchema.optional() }).strict();