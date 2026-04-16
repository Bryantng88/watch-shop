import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutMaintenanceRecordsInputObjectSchema as ProductCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordsInput.schema';
import { ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema as ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateOrConnectWithoutMaintenanceRecordsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutMaintenanceRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutMaintenanceRecordsInput>;
export const ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectZodSchema = makeSchema();
