import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutMaintenanceRecordsInputObjectSchema as ProductCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordsInput.schema';
import { ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema as ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateOrConnectWithoutMaintenanceRecordsInput.schema';
import { ProductUpsertWithoutMaintenanceRecordsInputObjectSchema as ProductUpsertWithoutMaintenanceRecordsInputObjectSchema } from './ProductUpsertWithoutMaintenanceRecordsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInputObjectSchema as ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInput.schema';
import { ProductUpdateWithoutMaintenanceRecordsInputObjectSchema as ProductUpdateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUpdateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedUpdateWithoutMaintenanceRecordsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutMaintenanceRecordsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUpdateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutMaintenanceRecordsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutMaintenanceRecordsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutMaintenanceRecordsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutMaintenanceRecordsNestedInput>;
export const ProductUpdateOneWithoutMaintenanceRecordsNestedInputObjectZodSchema = makeSchema();
