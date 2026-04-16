import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ProductVariantUpsertWithoutMaintenanceRecordInputObjectSchema as ProductVariantUpsertWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUpsertWithoutMaintenanceRecordInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUpdateWithoutMaintenanceRecordInput.schema';
import { ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneWithoutMaintenanceRecordNestedInput>;
export const ProductVariantUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
