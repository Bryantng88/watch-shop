import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionCreateManyInputObjectSchema as AcquisitionCreateManyInputObjectSchema } from './objects/AcquisitionCreateManyInput.schema';

export const AcquisitionCreateManySchema: z.ZodType<Prisma.AcquisitionCreateManyArgs> = z.object({ data: z.union([ AcquisitionCreateManyInputObjectSchema, z.array(AcquisitionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionCreateManyArgs>;

export const AcquisitionCreateManyZodSchema = z.object({ data: z.union([ AcquisitionCreateManyInputObjectSchema, z.array(AcquisitionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();