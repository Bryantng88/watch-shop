import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutBrandInputObjectSchema as ProductUpdateWithoutBrandInputObjectSchema } from './ProductUpdateWithoutBrandInput.schema';
import { ProductUncheckedUpdateWithoutBrandInputObjectSchema as ProductUncheckedUpdateWithoutBrandInputObjectSchema } from './ProductUncheckedUpdateWithoutBrandInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBrandInputObjectSchema)])
}).strict();
export const ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutBrandInput>;
export const ProductUpdateWithWhereUniqueWithoutBrandInputObjectZodSchema = makeSchema();
