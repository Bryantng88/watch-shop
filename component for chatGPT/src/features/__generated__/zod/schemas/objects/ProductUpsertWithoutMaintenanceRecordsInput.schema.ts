import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutMaintenanceRecordsInputObjectSchema as ProductUpdateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUpdateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedUpdateWithoutMaintenanceRecordsInput.schema';
import { ProductCreateWithoutMaintenanceRecordsInputObjectSchema as ProductCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutMaintenanceRecordsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutMaintenanceRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutMaintenanceRecordsInput>;
export const ProductUpsertWithoutMaintenanceRecordsInputObjectZodSchema = makeSchema();
