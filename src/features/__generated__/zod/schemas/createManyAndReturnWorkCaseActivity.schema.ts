import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivitySelectObjectSchema as WorkCaseActivitySelectObjectSchema } from './objects/WorkCaseActivitySelect.schema';
import { WorkCaseActivityCreateManyInputObjectSchema as WorkCaseActivityCreateManyInputObjectSchema } from './objects/WorkCaseActivityCreateManyInput.schema';

export const WorkCaseActivityCreateManyAndReturnSchema: z.ZodType<Prisma.WorkCaseActivityCreateManyAndReturnArgs> = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), data: z.union([ WorkCaseActivityCreateManyInputObjectSchema, z.array(WorkCaseActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateManyAndReturnArgs>;

export const WorkCaseActivityCreateManyAndReturnZodSchema = z.object({ select: WorkCaseActivitySelectObjectSchema.optional(), data: z.union([ WorkCaseActivityCreateManyInputObjectSchema, z.array(WorkCaseActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();