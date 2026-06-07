import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ShipmentWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ShipmentWhereInputObjectSchema).optional().nullable()
}).strict();
export const ShipmentNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ShipmentNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentNullableScalarRelationFilter>;
export const ShipmentNullableScalarRelationFilterObjectZodSchema = makeSchema();
