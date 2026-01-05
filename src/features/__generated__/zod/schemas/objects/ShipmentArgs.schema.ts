import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './ShipmentInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ShipmentSelectObjectSchema).optional(),
  include: z.lazy(() => ShipmentIncludeObjectSchema).optional()
}).strict();
export const ShipmentArgsObjectSchema = makeSchema();
export const ShipmentArgsObjectZodSchema = makeSchema();
