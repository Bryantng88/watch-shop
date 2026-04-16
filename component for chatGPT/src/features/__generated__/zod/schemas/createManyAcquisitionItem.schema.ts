import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionItemCreateManyInputObjectSchema as AcquisitionItemCreateManyInputObjectSchema } from './objects/AcquisitionItemCreateManyInput.schema';

export const AcquisitionItemCreateManySchema: z.ZodType<Prisma.AcquisitionItemCreateManyArgs> = z.object({ data: z.union([ AcquisitionItemCreateManyInputObjectSchema, z.array(AcquisitionItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyArgs>;

export const AcquisitionItemCreateManyZodSchema = z.object({ data: z.union([ AcquisitionItemCreateManyInputObjectSchema, z.array(AcquisitionItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();