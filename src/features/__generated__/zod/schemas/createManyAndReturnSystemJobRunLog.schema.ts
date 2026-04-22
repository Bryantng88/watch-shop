import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogCreateManyInputObjectSchema as SystemJobRunLogCreateManyInputObjectSchema } from './objects/SystemJobRunLogCreateManyInput.schema';

export const SystemJobRunLogCreateManyAndReturnSchema: z.ZodType<Prisma.SystemJobRunLogCreateManyAndReturnArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(), data: z.union([ SystemJobRunLogCreateManyInputObjectSchema, z.array(SystemJobRunLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogCreateManyAndReturnArgs>;

export const SystemJobRunLogCreateManyAndReturnZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(), data: z.union([ SystemJobRunLogCreateManyInputObjectSchema, z.array(SystemJobRunLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();