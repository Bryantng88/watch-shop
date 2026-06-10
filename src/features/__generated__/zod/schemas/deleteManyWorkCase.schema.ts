import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './objects/WorkCaseWhereInput.schema';

export const WorkCaseDeleteManySchema: z.ZodType<Prisma.WorkCaseDeleteManyArgs> = z.object({ where: WorkCaseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseDeleteManyArgs>;

export const WorkCaseDeleteManyZodSchema = z.object({ where: WorkCaseWhereInputObjectSchema.optional() }).strict();