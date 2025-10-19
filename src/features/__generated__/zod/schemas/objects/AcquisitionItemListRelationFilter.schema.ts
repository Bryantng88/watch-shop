import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './AcquisitionItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => AcquisitionItemWhereInputObjectSchema).optional()
}).strict();
export const AcquisitionItemListRelationFilterObjectSchema: z.ZodType<Prisma.AcquisitionItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemListRelationFilter>;
export const AcquisitionItemListRelationFilterObjectZodSchema = makeSchema();
