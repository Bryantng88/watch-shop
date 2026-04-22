import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogCreateManyInputObjectSchema as SystemJobRunLogCreateManyInputObjectSchema } from './objects/SystemJobRunLogCreateManyInput.schema';

export const SystemJobRunLogCreateManySchema: z.ZodType<Prisma.SystemJobRunLogCreateManyArgs> = z.object({ data: z.union([ SystemJobRunLogCreateManyInputObjectSchema, z.array(SystemJobRunLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogCreateManyArgs>;

export const SystemJobRunLogCreateManyZodSchema = z.object({ data: z.union([ SystemJobRunLogCreateManyInputObjectSchema, z.array(SystemJobRunLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();