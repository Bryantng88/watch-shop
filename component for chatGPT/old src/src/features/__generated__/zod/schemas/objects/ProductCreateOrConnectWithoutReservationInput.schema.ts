import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutReservationInputObjectSchema as ProductCreateWithoutReservationInputObjectSchema } from './ProductCreateWithoutReservationInput.schema';
import { ProductUncheckedCreateWithoutReservationInputObjectSchema as ProductUncheckedCreateWithoutReservationInputObjectSchema } from './ProductUncheckedCreateWithoutReservationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutReservationInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutReservationInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutReservationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutReservationInput>;
export const ProductCreateOrConnectWithoutReservationInputObjectZodSchema = makeSchema();
