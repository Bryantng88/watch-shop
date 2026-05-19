import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentListRelationFilterObjectSchema: z.ZodType<Prisma.ShipmentListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentListRelationFilter>;
export const ShipmentListRelationFilterObjectZodSchema = makeSchema();
