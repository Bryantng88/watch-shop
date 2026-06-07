import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCountOutputTypeSelectObjectSchema as ShipmentCountOutputTypeSelectObjectSchema } from './ShipmentCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ShipmentCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ShipmentCountOutputTypeArgsObjectSchema = makeSchema();
export const ShipmentCountOutputTypeArgsObjectZodSchema = makeSchema();
