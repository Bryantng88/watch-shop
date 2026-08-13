import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageWhereInputObjectSchema as ShipmentPackageWhereInputObjectSchema } from './ShipmentPackageWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ShipmentPackageWhereInputObjectSchema).optional(),
  some: z.lazy(() => ShipmentPackageWhereInputObjectSchema).optional(),
  none: z.lazy(() => ShipmentPackageWhereInputObjectSchema).optional()
}).strict();
export const ShipmentPackageListRelationFilterObjectSchema: z.ZodType<Prisma.ShipmentPackageListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageListRelationFilter>;
export const ShipmentPackageListRelationFilterObjectZodSchema = makeSchema();
