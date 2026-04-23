import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './objects/AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogCreateManyInputObjectSchema as AcquisitionSpecJobLogCreateManyInputObjectSchema } from './objects/AcquisitionSpecJobLogCreateManyInput.schema';

export const AcquisitionSpecJobLogCreateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionSpecJobLogCreateManyAndReturnArgs> = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), data: z.union([ AcquisitionSpecJobLogCreateManyInputObjectSchema, z.array(AcquisitionSpecJobLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogCreateManyAndReturnArgs>;

export const AcquisitionSpecJobLogCreateManyAndReturnZodSchema = z.object({ select: AcquisitionSpecJobLogSelectObjectSchema.optional(), data: z.union([ AcquisitionSpecJobLogCreateManyInputObjectSchema, z.array(AcquisitionSpecJobLogCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();