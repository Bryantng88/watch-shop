import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogCreateManyInputObjectSchema as AcquisitionSpecJobLogCreateManyInputObjectSchema } from './objects/AcquisitionSpecJobLogCreateManyInput.schema';

export const AcquisitionSpecJobLogCreateManySchema: z.ZodType<Prisma.AcquisitionSpecJobLogCreateManyArgs> = z.object({ data: z.union([ AcquisitionSpecJobLogCreateManyInputObjectSchema, z.array(AcquisitionSpecJobLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogCreateManyArgs>;

export const AcquisitionSpecJobLogCreateManyZodSchema = z.object({ data: z.union([ AcquisitionSpecJobLogCreateManyInputObjectSchema, z.array(AcquisitionSpecJobLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();