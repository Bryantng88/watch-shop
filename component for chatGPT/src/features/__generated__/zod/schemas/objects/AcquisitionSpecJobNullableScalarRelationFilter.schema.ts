import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional().nullable()
}).strict();
export const AcquisitionSpecJobNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobNullableScalarRelationFilter>;
export const AcquisitionSpecJobNullableScalarRelationFilterObjectZodSchema = makeSchema();
