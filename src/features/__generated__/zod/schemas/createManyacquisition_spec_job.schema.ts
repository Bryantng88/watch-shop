import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { acquisition_spec_jobCreateManyInputObjectSchema as acquisition_spec_jobCreateManyInputObjectSchema } from './objects/acquisition_spec_jobCreateManyInput.schema';

export const acquisition_spec_jobCreateManySchema: z.ZodType<Prisma.acquisition_spec_jobCreateManyArgs> = z.object({ data: z.union([ acquisition_spec_jobCreateManyInputObjectSchema, z.array(acquisition_spec_jobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.acquisition_spec_jobCreateManyArgs>;

export const acquisition_spec_jobCreateManyZodSchema = z.object({ data: z.union([ acquisition_spec_jobCreateManyInputObjectSchema, z.array(acquisition_spec_jobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();