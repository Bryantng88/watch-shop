import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutWatchSpecInputObjectSchema as ProductCreateWithoutWatchSpecInputObjectSchema } from './ProductCreateWithoutWatchSpecInput.schema';
import { ProductUncheckedCreateWithoutWatchSpecInputObjectSchema as ProductUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedCreateWithoutWatchSpecInput.schema';
import { ProductCreateOrConnectWithoutWatchSpecInputObjectSchema as ProductCreateOrConnectWithoutWatchSpecInputObjectSchema } from './ProductCreateOrConnectWithoutWatchSpecInput.schema';
import { ProductUpsertWithoutWatchSpecInputObjectSchema as ProductUpsertWithoutWatchSpecInputObjectSchema } from './ProductUpsertWithoutWatchSpecInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutWatchSpecInputObjectSchema as ProductUpdateToOneWithWhereWithoutWatchSpecInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutWatchSpecInput.schema';
import { ProductUpdateWithoutWatchSpecInputObjectSchema as ProductUpdateWithoutWatchSpecInputObjectSchema } from './ProductUpdateWithoutWatchSpecInput.schema';
import { ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema as ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedUpdateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutWatchSpecInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutWatchSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutWatchSpecNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutWatchSpecNestedInput>;
export const ProductUpdateOneRequiredWithoutWatchSpecNestedInputObjectZodSchema = makeSchema();
