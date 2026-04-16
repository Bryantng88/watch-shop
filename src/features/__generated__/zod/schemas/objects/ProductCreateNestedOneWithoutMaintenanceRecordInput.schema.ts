import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutMaintenanceRecordInputObjectSchema as ProductCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateWithoutMaintenanceRecordInput.schema';
import { ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ProductUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutMaintenanceRecordInput>;
export const ProductCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
