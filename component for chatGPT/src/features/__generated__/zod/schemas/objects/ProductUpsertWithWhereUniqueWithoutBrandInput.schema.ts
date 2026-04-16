import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutBrandInputObjectSchema as ProductUpdateWithoutBrandInputObjectSchema } from './ProductUpdateWithoutBrandInput.schema';
import { ProductUncheckedUpdateWithoutBrandInputObjectSchema as ProductUncheckedUpdateWithoutBrandInputObjectSchema } from './ProductUncheckedUpdateWithoutBrandInput.schema';
import { ProductCreateWithoutBrandInputObjectSchema as ProductCreateWithoutBrandInputObjectSchema } from './ProductCreateWithoutBrandInput.schema';
import { ProductUncheckedCreateWithoutBrandInputObjectSchema as ProductUncheckedCreateWithoutBrandInputObjectSchema } from './ProductUncheckedCreateWithoutBrandInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductUpdateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBrandInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema)])
}).strict();
export const ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutBrandInput>;
export const ProductUpsertWithWhereUniqueWithoutBrandInputObjectZodSchema = makeSchema();
