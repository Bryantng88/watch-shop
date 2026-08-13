import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestWhereInputObjectSchema as CarrierRequestWhereInputObjectSchema } from './CarrierRequestWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CarrierRequestWhereInputObjectSchema).optional(),
  some: z.lazy(() => CarrierRequestWhereInputObjectSchema).optional(),
  none: z.lazy(() => CarrierRequestWhereInputObjectSchema).optional()
}).strict();
export const CarrierRequestListRelationFilterObjectSchema: z.ZodType<Prisma.CarrierRequestListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestListRelationFilter>;
export const CarrierRequestListRelationFilterObjectZodSchema = makeSchema();
