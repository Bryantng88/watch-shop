import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutReservationInputObjectSchema as ProductCreateWithoutReservationInputObjectSchema } from './ProductCreateWithoutReservationInput.schema';
import { ProductUncheckedCreateWithoutReservationInputObjectSchema as ProductUncheckedCreateWithoutReservationInputObjectSchema } from './ProductUncheckedCreateWithoutReservationInput.schema';
import { ProductCreateOrConnectWithoutReservationInputObjectSchema as ProductCreateOrConnectWithoutReservationInputObjectSchema } from './ProductCreateOrConnectWithoutReservationInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutReservationInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutReservationInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutReservationInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutReservationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutReservationInput>;
export const ProductCreateNestedOneWithoutReservationInputObjectZodSchema = makeSchema();
