import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutMaintenanceRecordInputObjectSchema as VendorCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { VendorUpsertWithoutMaintenanceRecordInputObjectSchema as VendorUpsertWithoutMaintenanceRecordInputObjectSchema } from './VendorUpsertWithoutMaintenanceRecordInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as VendorUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { VendorUpdateWithoutMaintenanceRecordInputObjectSchema as VendorUpdateWithoutMaintenanceRecordInputObjectSchema } from './VendorUpdateWithoutMaintenanceRecordInput.schema';
import { VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './VendorUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutMaintenanceRecordNestedInput>;
export const VendorUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
