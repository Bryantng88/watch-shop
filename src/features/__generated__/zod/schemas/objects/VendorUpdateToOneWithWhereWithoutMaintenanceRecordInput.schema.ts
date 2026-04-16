import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutMaintenanceRecordInputObjectSchema as VendorUpdateWithoutMaintenanceRecordInputObjectSchema } from './VendorUpdateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const VendorUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
