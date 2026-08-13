import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ShipmentWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ShipmentWhereInputObjectSchema).optional()
}).strict();
export const ShipmentScalarRelationFilterObjectSchema: z.ZodType<Prisma.ShipmentScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentScalarRelationFilter>;
export const ShipmentScalarRelationFilterObjectZodSchema = makeSchema();
