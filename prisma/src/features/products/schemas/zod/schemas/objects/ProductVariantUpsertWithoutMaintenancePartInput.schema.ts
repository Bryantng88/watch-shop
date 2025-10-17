import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutMaintenancePartInputObjectSchema as ProductVariantUpdateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUpdateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutMaintenancePartInput.schema';
import { ProductVariantCreateWithoutMaintenancePartInputObjectSchema as ProductVariantCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenancePartInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutMaintenancePartInput>;
export const ProductVariantUpsertWithoutMaintenancePartInputObjectZodSchema = makeSchema();
