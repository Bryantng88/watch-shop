import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutReservationInputObjectSchema as ProductUpdateWithoutReservationInputObjectSchema } from './ProductUpdateWithoutReservationInput.schema';
import { ProductUncheckedUpdateWithoutReservationInputObjectSchema as ProductUncheckedUpdateWithoutReservationInputObjectSchema } from './ProductUncheckedUpdateWithoutReservationInput.schema';
import { ProductCreateWithoutReservationInputObjectSchema as ProductCreateWithoutReservationInputObjectSchema } from './ProductCreateWithoutReservationInput.schema';
import { ProductUncheckedCreateWithoutReservationInputObjectSchema as ProductUncheckedCreateWithoutReservationInputObjectSchema } from './ProductUncheckedCreateWithoutReservationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutReservationInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutReservationInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutReservationInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutReservationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutReservationInput>;
export const ProductUpsertWithoutReservationInputObjectZodSchema = makeSchema();
