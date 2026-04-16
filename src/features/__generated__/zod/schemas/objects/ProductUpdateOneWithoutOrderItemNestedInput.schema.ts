import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutOrderItemInputObjectSchema as ProductCreateWithoutOrderItemInputObjectSchema } from './ProductCreateWithoutOrderItemInput.schema';
import { ProductUncheckedCreateWithoutOrderItemInputObjectSchema as ProductUncheckedCreateWithoutOrderItemInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemInput.schema';
import { ProductCreateOrConnectWithoutOrderItemInputObjectSchema as ProductCreateOrConnectWithoutOrderItemInputObjectSchema } from './ProductCreateOrConnectWithoutOrderItemInput.schema';
import { ProductUpsertWithoutOrderItemInputObjectSchema as ProductUpsertWithoutOrderItemInputObjectSchema } from './ProductUpsertWithoutOrderItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutOrderItemInputObjectSchema as ProductUpdateToOneWithWhereWithoutOrderItemInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutOrderItemInput.schema';
import { ProductUpdateWithoutOrderItemInputObjectSchema as ProductUpdateWithoutOrderItemInputObjectSchema } from './ProductUpdateWithoutOrderItemInput.schema';
import { ProductUncheckedUpdateWithoutOrderItemInputObjectSchema as ProductUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ProductUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutOrderItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutOrderItemNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutOrderItemNestedInput>;
export const ProductUpdateOneWithoutOrderItemNestedInputObjectZodSchema = makeSchema();
