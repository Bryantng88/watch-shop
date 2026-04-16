import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './AcquisitionItemWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionItemScalarRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionItemScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemScalarRelationFilter>;
export const AcquisitionItemScalarRelationFilterObjectZodSchema = makeSchema();
