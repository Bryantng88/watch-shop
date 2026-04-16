import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutImageInputObjectSchema as ProductCreateWithoutImageInputObjectSchema } from './ProductCreateWithoutImageInput.schema';
import { ProductUncheckedCreateWithoutImageInputObjectSchema as ProductUncheckedCreateWithoutImageInputObjectSchema } from './ProductUncheckedCreateWithoutImageInput.schema';
import { ProductCreateOrConnectWithoutImageInputObjectSchema as ProductCreateOrConnectWithoutImageInputObjectSchema } from './ProductCreateOrConnectWithoutImageInput.schema';
import { ProductUpsertWithoutImageInputObjectSchema as ProductUpsertWithoutImageInputObjectSchema } from './ProductUpsertWithoutImageInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutImageInputObjectSchema as ProductUpdateToOneWithWhereWithoutImageInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutImageInput.schema';
import { ProductUpdateWithoutImageInputObjectSchema as ProductUpdateWithoutImageInputObjectSchema } from './ProductUpdateWithoutImageInput.schema';
import { ProductUncheckedUpdateWithoutImageInputObjectSchema as ProductUncheckedUpdateWithoutImageInputObjectSchema } from './ProductUncheckedUpdateWithoutImageInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutImageInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutImageInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutImageInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutImageInputObjectSchema), z.lazy(() => ProductUpdateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutImageInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutImageNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutImageNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutImageNestedInput>;
export const ProductUpdateOneRequiredWithoutImageNestedInputObjectZodSchema = makeSchema();
