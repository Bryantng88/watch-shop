import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUpdateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutMaintenanceRecordInput>;
export const ProductVariantUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
