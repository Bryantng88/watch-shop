import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageSelectObjectSchema as ShipmentPackageSelectObjectSchema } from './ShipmentPackageSelect.schema';
import { ShipmentPackageIncludeObjectSchema as ShipmentPackageIncludeObjectSchema } from './ShipmentPackageInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ShipmentPackageSelectObjectSchema).optional(),
  include: z.lazy(() => ShipmentPackageIncludeObjectSchema).optional()
}).strict();
export const ShipmentPackageArgsObjectSchema = makeSchema();
export const ShipmentPackageArgsObjectZodSchema = makeSchema();
