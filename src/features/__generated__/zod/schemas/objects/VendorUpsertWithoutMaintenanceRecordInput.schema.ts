import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutMaintenanceRecordInputObjectSchema as VendorUpdateWithoutMaintenanceRecordInputObjectSchema } from './VendorUpdateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { VendorCreateWithoutMaintenanceRecordInputObjectSchema as VendorCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutMaintenanceRecordInput>;
export const VendorUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
