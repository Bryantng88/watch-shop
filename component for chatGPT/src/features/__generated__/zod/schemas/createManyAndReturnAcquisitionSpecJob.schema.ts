import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './objects/AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobCreateManyInputObjectSchema as AcquisitionSpecJobCreateManyInputObjectSchema } from './objects/AcquisitionSpecJobCreateManyInput.schema';

export const AcquisitionSpecJobCreateManyAndReturnSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateManyAndReturnArgs> = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), data: z.union([ AcquisitionSpecJobCreateManyInputObjectSchema, z.array(AcquisitionSpecJobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateManyAndReturnArgs>;

export const AcquisitionSpecJobCreateManyAndReturnZodSchema = z.object({ select: AcquisitionSpecJobSelectObjectSchema.optional(), data: z.union([ AcquisitionSpecJobCreateManyInputObjectSchema, z.array(AcquisitionSpecJobCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();