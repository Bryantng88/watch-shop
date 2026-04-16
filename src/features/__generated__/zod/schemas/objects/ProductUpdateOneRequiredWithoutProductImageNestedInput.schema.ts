import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductImageInputObjectSchema as ProductCreateWithoutProductImageInputObjectSchema } from './ProductCreateWithoutProductImageInput.schema';
import { ProductUncheckedCreateWithoutProductImageInputObjectSchema as ProductUncheckedCreateWithoutProductImageInputObjectSchema } from './ProductUncheckedCreateWithoutProductImageInput.schema';
import { ProductCreateOrConnectWithoutProductImageInputObjectSchema as ProductCreateOrConnectWithoutProductImageInputObjectSchema } from './ProductCreateOrConnectWithoutProductImageInput.schema';
import { ProductUpsertWithoutProductImageInputObjectSchema as ProductUpsertWithoutProductImageInputObjectSchema } from './ProductUpsertWithoutProductImageInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutProductImageInputObjectSchema as ProductUpdateToOneWithWhereWithoutProductImageInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutProductImageInput.schema';
import { ProductUpdateWithoutProductImageInputObjectSchema as ProductUpdateWithoutProductImageInputObjectSchema } from './ProductUpdateWithoutProductImageInput.schema';
import { ProductUncheckedUpdateWithoutProductImageInputObjectSchema as ProductUncheckedUpdateWithoutProductImageInputObjectSchema } from './ProductUncheckedUpdateWithoutProductImageInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductImageInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductImageInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutProductImageInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutProductImageInputObjectSchema), z.lazy(() => ProductUpdateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductImageInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutProductImageNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductImageNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductImageNestedInput>;
export const ProductUpdateOneRequiredWithoutProductImageNestedInputObjectZodSchema = makeSchema();
