import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutWatchInputObjectSchema as ProductCreateWithoutWatchInputObjectSchema } from './ProductCreateWithoutWatchInput.schema';
import { ProductUncheckedCreateWithoutWatchInputObjectSchema as ProductUncheckedCreateWithoutWatchInputObjectSchema } from './ProductUncheckedCreateWithoutWatchInput.schema';
import { ProductCreateOrConnectWithoutWatchInputObjectSchema as ProductCreateOrConnectWithoutWatchInputObjectSchema } from './ProductCreateOrConnectWithoutWatchInput.schema';
import { ProductUpsertWithoutWatchInputObjectSchema as ProductUpsertWithoutWatchInputObjectSchema } from './ProductUpsertWithoutWatchInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutWatchInputObjectSchema as ProductUpdateToOneWithWhereWithoutWatchInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutWatchInput.schema';
import { ProductUpdateWithoutWatchInputObjectSchema as ProductUpdateWithoutWatchInputObjectSchema } from './ProductUpdateWithoutWatchInput.schema';
import { ProductUncheckedUpdateWithoutWatchInputObjectSchema as ProductUncheckedUpdateWithoutWatchInputObjectSchema } from './ProductUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutWatchInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutWatchInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutWatchInputObjectSchema), z.lazy(() => ProductUpdateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutWatchInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutWatchNestedInput>;
export const ProductUpdateOneRequiredWithoutWatchNestedInputObjectZodSchema = makeSchema();
