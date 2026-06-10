import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseCreateManyInputObjectSchema as WorkCaseCreateManyInputObjectSchema } from './objects/WorkCaseCreateManyInput.schema';

export const WorkCaseCreateManySchema: z.ZodType<Prisma.WorkCaseCreateManyArgs> = z.object({ data: z.union([ WorkCaseCreateManyInputObjectSchema, z.array(WorkCaseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCreateManyArgs>;

export const WorkCaseCreateManyZodSchema = z.object({ data: z.union([ WorkCaseCreateManyInputObjectSchema, z.array(WorkCaseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();