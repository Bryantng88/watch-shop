import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutOrderItemInputObjectSchema as ProductCreateWithoutOrderItemInputObjectSchema } from './ProductCreateWithoutOrderItemInput.schema';
import { ProductUncheckedCreateWithoutOrderItemInputObjectSchema as ProductUncheckedCreateWithoutOrderItemInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemInput.schema';
import { ProductCreateOrConnectWithoutOrderItemInputObjectSchema as ProductCreateOrConnectWithoutOrderItemInputObjectSchema } from './ProductCreateOrConnectWithoutOrderItemInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutOrderItemInput>;
export const ProductCreateNestedOneWithoutOrderItemInputObjectZodSchema = makeSchema();
