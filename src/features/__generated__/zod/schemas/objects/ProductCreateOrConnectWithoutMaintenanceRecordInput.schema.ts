import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutMaintenanceRecordInputObjectSchema as ProductCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutMaintenanceRecordInput>;
export const ProductCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
