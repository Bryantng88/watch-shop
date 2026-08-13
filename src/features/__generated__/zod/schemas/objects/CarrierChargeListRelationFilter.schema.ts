import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeWhereInputObjectSchema as CarrierChargeWhereInputObjectSchema } from './CarrierChargeWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CarrierChargeWhereInputObjectSchema).optional(),
  some: z.lazy(() => CarrierChargeWhereInputObjectSchema).optional(),
  none: z.lazy(() => CarrierChargeWhereInputObjectSchema).optional()
}).strict();
export const CarrierChargeListRelationFilterObjectSchema: z.ZodType<Prisma.CarrierChargeListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeListRelationFilter>;
export const CarrierChargeListRelationFilterObjectZodSchema = makeSchema();
