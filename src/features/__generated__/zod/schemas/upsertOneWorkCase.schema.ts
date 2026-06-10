import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './objects/WorkCaseSelect.schema';
import { WorkCaseIncludeObjectSchema as WorkCaseIncludeObjectSchema } from './objects/WorkCaseInclude.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './objects/WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateInputObjectSchema as WorkCaseCreateInputObjectSchema } from './objects/WorkCaseCreateInput.schema';
import { WorkCaseUncheckedCreateInputObjectSchema as WorkCaseUncheckedCreateInputObjectSchema } from './objects/WorkCaseUncheckedCreateInput.schema';
import { WorkCaseUpdateInputObjectSchema as WorkCaseUpdateInputObjectSchema } from './objects/WorkCaseUpdateInput.schema';
import { WorkCaseUncheckedUpdateInputObjectSchema as WorkCaseUncheckedUpdateInputObjectSchema } from './objects/WorkCaseUncheckedUpdateInput.schema';

export const WorkCaseUpsertOneSchema: z.ZodType<Prisma.WorkCaseUpsertArgs> = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), where: WorkCaseWhereUniqueInputObjectSchema, create: z.union([ WorkCaseCreateInputObjectSchema, WorkCaseUncheckedCreateInputObjectSchema ]), update: z.union([ WorkCaseUpdateInputObjectSchema, WorkCaseUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkCaseUpsertArgs>;

export const WorkCaseUpsertOneZodSchema = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), where: WorkCaseWhereUniqueInputObjectSchema, create: z.union([ WorkCaseCreateInputObjectSchema, WorkCaseUncheckedCreateInputObjectSchema ]), update: z.union([ WorkCaseUpdateInputObjectSchema, WorkCaseUncheckedUpdateInputObjectSchema ]) }).strict();