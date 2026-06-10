import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './objects/WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';

export const WorkCaseUpdateManySchema: z.ZodType<Prisma.WorkCaseUpdateManyArgs> = z.object({ data: WorkCaseUpdateManyMutationInputObjectSchema, where: WorkCaseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyArgs>;

export const WorkCaseUpdateManyZodSchema = z.object({ data: WorkCaseUpdateManyMutationInputObjectSchema, where: WorkCaseWhereInputObjectSchema.optional() }).strict();