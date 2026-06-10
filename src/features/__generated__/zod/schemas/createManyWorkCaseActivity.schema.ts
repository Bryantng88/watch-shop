import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseActivityCreateManyInputObjectSchema as WorkCaseActivityCreateManyInputObjectSchema } from './objects/WorkCaseActivityCreateManyInput.schema';

export const WorkCaseActivityCreateManySchema: z.ZodType<Prisma.WorkCaseActivityCreateManyArgs> = z.object({ data: z.union([ WorkCaseActivityCreateManyInputObjectSchema, z.array(WorkCaseActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateManyArgs>;

export const WorkCaseActivityCreateManyZodSchema = z.object({ data: z.union([ WorkCaseActivityCreateManyInputObjectSchema, z.array(WorkCaseActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();