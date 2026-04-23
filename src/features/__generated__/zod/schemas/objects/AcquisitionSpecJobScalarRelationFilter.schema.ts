import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobScalarRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobScalarRelationFilter>;
export const AcquisitionSpecJobScalarRelationFilterObjectZodSchema = makeSchema();
