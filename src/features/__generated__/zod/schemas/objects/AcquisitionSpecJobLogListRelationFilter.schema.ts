import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogWhereInputObjectSchema as AcquisitionSpecJobLogWhereInputObjectSchema } from './AcquisitionSpecJobLogWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema).optional(),
  some: z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema).optional(),
  none: z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobLogListRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogListRelationFilter>;
export const AcquisitionSpecJobLogListRelationFilterObjectZodSchema = makeSchema();
