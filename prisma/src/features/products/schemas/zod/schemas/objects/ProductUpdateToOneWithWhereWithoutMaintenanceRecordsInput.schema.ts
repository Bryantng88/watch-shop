import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutMaintenanceRecordsInputObjectSchema as ProductUpdateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUpdateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedUpdateWithoutMaintenanceRecordsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInput>;
export const ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInputObjectZodSchema = makeSchema();
