import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantScalarWhereInputObjectSchema as ProductVariantScalarWhereInputObjectSchema } from './ProductVariantScalarWhereInput.schema';
import { ProductVariantUpdateManyMutationInputObjectSchema as ProductVariantUpdateManyMutationInputObjectSchema } from './ProductVariantUpdateManyMutationInput.schema';
import { ProductVariantUncheckedUpdateManyWithoutProductInputObjectSchema as ProductVariantUncheckedUpdateManyWithoutProductInputObjectSchema } from './ProductVariantUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductVariantUpdateManyMutationInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const ProductVariantUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateManyWithWhereWithoutProductInput>;
export const ProductVariantUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
