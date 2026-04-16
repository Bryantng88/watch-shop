import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutMaintenanceRecordInputObjectSchema as ProductUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductUpdateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const ProductUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
