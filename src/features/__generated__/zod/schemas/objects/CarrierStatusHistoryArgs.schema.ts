import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistorySelectObjectSchema as CarrierStatusHistorySelectObjectSchema } from './CarrierStatusHistorySelect.schema';
import { CarrierStatusHistoryIncludeObjectSchema as CarrierStatusHistoryIncludeObjectSchema } from './CarrierStatusHistoryInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CarrierStatusHistorySelectObjectSchema).optional(),
  include: z.lazy(() => CarrierStatusHistoryIncludeObjectSchema).optional()
}).strict();
export const CarrierStatusHistoryArgsObjectSchema = makeSchema();
export const CarrierStatusHistoryArgsObjectZodSchema = makeSchema();
