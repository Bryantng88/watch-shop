import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './objects/acquisition_spec_jobSelect.schema';
import { acquisition_spec_jobCreateManyInputObjectSchema as acquisition_spec_jobCreateManyInputObjectSchema } from './objects/acquisition_spec_jobCreateManyInput.schema';

export const acquisition_spec_jobCreateManyAndReturnSchema: z.ZodType<Prisma.acquisition_spec_jobCreateManyAndReturnArgs> = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(), data: z.union([ acquisition_spec_jobCreateManyInputObjectSchema, z.array(acquisition_spec_jobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobCreateManyAndReturnArgs>;

export const acquisition_spec_jobCreateManyAndReturnZodSchema = z.object({ select: acquisition_spec_jobSelectObjectSchema.optional(), data: z.union([ acquisition_spec_jobCreateManyInputObjectSchema, z.array(acquisition_spec_jobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();