import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './objects/WorkCaseSelect.schema';
import { WorkCaseIncludeObjectSchema as WorkCaseIncludeObjectSchema } from './objects/WorkCaseInclude.schema';
import { WorkCaseUpdateInputObjectSchema as WorkCaseUpdateInputObjectSchema } from './objects/WorkCaseUpdateInput.schema';
import { WorkCaseUncheckedUpdateInputObjectSchema as WorkCaseUncheckedUpdateInputObjectSchema } from './objects/WorkCaseUncheckedUpdateInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './objects/WorkCaseWhereUniqueInput.schema';

export const WorkCaseUpdateOneSchema: z.ZodType<Prisma.WorkCaseUpdateArgs> = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), data: z.union([WorkCaseUpdateInputObjectSchema, WorkCaseUncheckedUpdateInputObjectSchema]), where: WorkCaseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkCaseUpdateArgs>;

export const WorkCaseUpdateOneZodSchema = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), data: z.union([WorkCaseUpdateInputObjectSchema, WorkCaseUncheckedUpdateInputObjectSchema]), where: WorkCaseWhereUniqueInputObjectSchema }).strict();