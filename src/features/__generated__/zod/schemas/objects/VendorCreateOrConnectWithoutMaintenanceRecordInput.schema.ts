import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutMaintenanceRecordInputObjectSchema as VendorCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutMaintenanceRecordInput>;
export const VendorCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
