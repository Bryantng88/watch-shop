import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutMaintenanceRecordsInputObjectSchema as ProductCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordsInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutMaintenanceRecordsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutMaintenanceRecordsInput>;
export const ProductCreateOrConnectWithoutMaintenanceRecordsInputObjectZodSchema = makeSchema();
