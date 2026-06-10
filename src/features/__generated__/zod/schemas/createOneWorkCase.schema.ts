import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './objects/WorkCaseSelect.schema';
import { WorkCaseIncludeObjectSchema as WorkCaseIncludeObjectSchema } from './objects/WorkCaseInclude.schema';
import { WorkCaseCreateInputObjectSchema as WorkCaseCreateInputObjectSchema } from './objects/WorkCaseCreateInput.schema';
import { WorkCaseUncheckedCreateInputObjectSchema as WorkCaseUncheckedCreateInputObjectSchema } from './objects/WorkCaseUncheckedCreateInput.schema';

export const WorkCaseCreateOneSchema: z.ZodType<Prisma.WorkCaseCreateArgs> = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), data: z.union([WorkCaseCreateInputObjectSchema, WorkCaseUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkCaseCreateArgs>;

export const WorkCaseCreateOneZodSchema = z.object({ select: WorkCaseSelectObjectSchema.optional(), include: WorkCaseIncludeObjectSchema.optional(), data: z.union([WorkCaseCreateInputObjectSchema, WorkCaseUncheckedCreateInputObjectSchema]) }).strict();