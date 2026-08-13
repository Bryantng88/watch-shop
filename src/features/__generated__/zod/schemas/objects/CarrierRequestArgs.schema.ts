import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './CarrierRequestSelect.schema';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './CarrierRequestInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CarrierRequestSelectObjectSchema).optional(),
  include: z.lazy(() => CarrierRequestIncludeObjectSchema).optional()
}).strict();
export const CarrierRequestArgsObjectSchema = makeSchema();
export const CarrierRequestArgsObjectZodSchema = makeSchema();
