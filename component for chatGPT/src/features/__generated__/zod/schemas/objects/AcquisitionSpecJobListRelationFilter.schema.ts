import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional(),
  some: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional(),
  none: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobListRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobListRelationFilter>;
export const AcquisitionSpecJobListRelationFilterObjectZodSchema = makeSchema();
