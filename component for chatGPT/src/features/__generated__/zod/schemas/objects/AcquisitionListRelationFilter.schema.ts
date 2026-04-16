import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => AcquisitionWhereInputObjectSchema).optional(),
  some: z.lazy(() => AcquisitionWhereInputObjectSchema).optional(),
  none: z.lazy(() => AcquisitionWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionListRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionListRelationFilter>;
export const AcquisitionListRelationFilterObjectZodSchema = makeSchema();
