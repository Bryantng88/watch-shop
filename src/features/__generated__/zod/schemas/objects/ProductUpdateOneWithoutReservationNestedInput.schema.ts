import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutReservationInputObjectSchema as ProductCreateWithoutReservationInputObjectSchema } from './ProductCreateWithoutReservationInput.schema';
import { ProductUncheckedCreateWithoutReservationInputObjectSchema as ProductUncheckedCreateWithoutReservationInputObjectSchema } from './ProductUncheckedCreateWithoutReservationInput.schema';
import { ProductCreateOrConnectWithoutReservationInputObjectSchema as ProductCreateOrConnectWithoutReservationInputObjectSchema } from './ProductCreateOrConnectWithoutReservationInput.schema';
import { ProductUpsertWithoutReservationInputObjectSchema as ProductUpsertWithoutReservationInputObjectSchema } from './ProductUpsertWithoutReservationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutReservationInputObjectSchema as ProductUpdateToOneWithWhereWithoutReservationInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutReservationInput.schema';
import { ProductUpdateWithoutReservationInputObjectSchema as ProductUpdateWithoutReservationInputObjectSchema } from './ProductUpdateWithoutReservationInput.schema';
import { ProductUncheckedUpdateWithoutReservationInputObjectSchema as ProductUncheckedUpdateWithoutReservationInputObjectSchema } from './ProductUncheckedUpdateWithoutReservationInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutReservationInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutReservationInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutReservationInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutReservationInputObjectSchema), z.lazy(() => ProductUpdateWithoutReservationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutReservationInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutReservationNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutReservationNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutReservationNestedInput>;
export const ProductUpdateOneWithoutReservationNestedInputObjectZodSchema = makeSchema();
