import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutOrderItemInputObjectSchema as ProductCreateWithoutOrderItemInputObjectSchema } from './ProductCreateWithoutOrderItemInput.schema';
import { ProductUncheckedCreateWithoutOrderItemInputObjectSchema as ProductUncheckedCreateWithoutOrderItemInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutOrderItemInput>;
export const ProductCreateOrConnectWithoutOrderItemInputObjectZodSchema = makeSchema();
