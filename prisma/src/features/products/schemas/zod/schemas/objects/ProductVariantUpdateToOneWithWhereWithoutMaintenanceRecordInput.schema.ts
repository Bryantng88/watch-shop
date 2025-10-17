import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUpdateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
