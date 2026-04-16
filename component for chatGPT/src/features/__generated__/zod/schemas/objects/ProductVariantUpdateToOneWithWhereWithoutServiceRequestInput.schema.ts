import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutServiceRequestInputObjectSchema as ProductVariantUpdateWithoutServiceRequestInputObjectSchema } from './ProductVariantUpdateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutServiceRequestInput>;
export const ProductVariantUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
