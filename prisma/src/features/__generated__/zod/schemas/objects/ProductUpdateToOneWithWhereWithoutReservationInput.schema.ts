import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutReservationInputObjectSchema as ProductUpdateWithoutReservationInputObjectSchema } from './ProductUpdateWithoutReservationInput.schema';
import { ProductUncheckedUpdateWithoutReservationInputObjectSchema as ProductUncheckedUpdateWithoutReservationInputObjectSchema } from './ProductUncheckedUpdateWithoutReservationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutReservationInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutReservationInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutReservationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutReservationInput>;
export const ProductUpdateToOneWithWhereWithoutReservationInputObjectZodSchema = makeSchema();
