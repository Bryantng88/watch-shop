import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutMaintenanceRecordInputObjectSchema as VendorCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutMaintenanceRecordInput>;
export const VendorCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
