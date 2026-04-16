import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobCreateManyInputObjectSchema as AcquisitionSpecJobCreateManyInputObjectSchema } from './objects/AcquisitionSpecJobCreateManyInput.schema';

export const AcquisitionSpecJobCreateManySchema: z.ZodType<Prisma.AcquisitionSpecJobCreateManyArgs> = z.object({ data: z.union([ AcquisitionSpecJobCreateManyInputObjectSchema, z.array(AcquisitionSpecJobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateManyArgs>;

export const AcquisitionSpecJobCreateManyZodSchema = z.object({ data: z.union([ AcquisitionSpecJobCreateManyInputObjectSchema, z.array(AcquisitionSpecJobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();