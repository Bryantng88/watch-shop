import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutMaintenanceRecordInputObjectSchema as ProductCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ProductUpsertWithoutMaintenanceRecordInputObjectSchema as ProductUpsertWithoutMaintenanceRecordInputObjectSchema } from './ProductUpsertWithoutMaintenanceRecordInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as ProductUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { ProductUpdateWithoutMaintenanceRecordInputObjectSchema as ProductUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductUpdateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutMaintenanceRecordNestedInput>;
export const ProductUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
