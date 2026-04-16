import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => AcquisitionWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => AcquisitionWhereInputObjectSchema).optional().nullable()
}).strict();
export const AcquisitionNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionNullableScalarRelationFilter>;
export const AcquisitionNullableScalarRelationFilterObjectZodSchema = makeSchema();
