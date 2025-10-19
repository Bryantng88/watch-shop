import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutMaintenanceRecordInput>;
export const ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
