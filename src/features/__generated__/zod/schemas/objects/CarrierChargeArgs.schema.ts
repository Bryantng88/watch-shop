import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './CarrierChargeSelect.schema';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './CarrierChargeInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CarrierChargeSelectObjectSchema).optional(),
  include: z.lazy(() => CarrierChargeIncludeObjectSchema).optional()
}).strict();
export const CarrierChargeArgsObjectSchema = makeSchema();
export const CarrierChargeArgsObjectZodSchema = makeSchema();
