import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => AcquisitionWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AcquisitionWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionScalarRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionScalarRelationFilter>;
export const AcquisitionScalarRelationFilterObjectZodSchema = makeSchema();
