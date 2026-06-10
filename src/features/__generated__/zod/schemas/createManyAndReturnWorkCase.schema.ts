import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkCaseSelectObjectSchema as WorkCaseSelectObjectSchema } from './objects/WorkCaseSelect.schema';
import { WorkCaseCreateManyInputObjectSchema as WorkCaseCreateManyInputObjectSchema } from './objects/WorkCaseCreateManyInput.schema';

export const WorkCaseCreateManyAndReturnSchema: z.ZodType<Prisma.WorkCaseCreateManyAndReturnArgs> = z.object({ select: WorkCaseSelectObjectSchema.optional(), data: z.union([ WorkCaseCreateManyInputObjectSchema, z.array(WorkCaseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkCaseCreateManyAndReturnArgs>;

export const WorkCaseCreateManyAndReturnZodSchema = z.object({ select: WorkCaseSelectObjectSchema.optional(), data: z.union([ WorkCaseCreateManyInputObjectSchema, z.array(WorkCaseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();