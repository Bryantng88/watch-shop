import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutVariantsInputObjectSchema as ProductCreateWithoutVariantsInputObjectSchema } from './ProductCreateWithoutVariantsInput.schema';
import { ProductUncheckedCreateWithoutVariantsInputObjectSchema as ProductUncheckedCreateWithoutVariantsInputObjectSchema } from './ProductUncheckedCreateWithoutVariantsInput.schema';
import { ProductCreateOrConnectWithoutVariantsInputObjectSchema as ProductCreateOrConnectWithoutVariantsInputObjectSchema } from './ProductCreateOrConnectWithoutVariantsInput.schema';
import { ProductUpsertWithoutVariantsInputObjectSchema as ProductUpsertWithoutVariantsInputObjectSchema } from './ProductUpsertWithoutVariantsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutVariantsInputObjectSchema as ProductUpdateToOneWithWhereWithoutVariantsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutVariantsInput.schema';
import { ProductUpdateWithoutVariantsInputObjectSchema as ProductUpdateWithoutVariantsInputObjectSchema } from './ProductUpdateWithoutVariantsInput.schema';
import { ProductUncheckedUpdateWithoutVariantsInputObjectSchema as ProductUncheckedUpdateWithoutVariantsInputObjectSchema } from './ProductUncheckedUpdateWithoutVariantsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVariantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutVariantsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutVariantsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutVariantsInputObjectSchema), z.lazy(() => ProductUpdateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutVariantsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutVariantsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutVariantsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutVariantsNestedInput>;
export const ProductUpdateOneRequiredWithoutVariantsNestedInputObjectZodSchema = makeSchema();
