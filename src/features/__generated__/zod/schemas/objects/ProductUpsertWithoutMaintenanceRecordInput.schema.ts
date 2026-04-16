import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutMaintenanceRecordInputObjectSchema as ProductUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductUpdateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { ProductCreateWithoutMaintenanceRecordInputObjectSchema as ProductCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutMaintenanceRecordInput>;
export const ProductUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
