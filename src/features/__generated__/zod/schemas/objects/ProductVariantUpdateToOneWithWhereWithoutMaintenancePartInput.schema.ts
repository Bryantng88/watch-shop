import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutMaintenancePartInputObjectSchema as ProductVariantUpdateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUpdateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInput>;
export const ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInputObjectZodSchema = makeSchema();
