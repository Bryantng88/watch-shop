import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutMaintenanceRecordInput>;
export const ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
