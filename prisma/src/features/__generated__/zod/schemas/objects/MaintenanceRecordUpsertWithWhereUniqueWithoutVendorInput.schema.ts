import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutVendorInputObjectSchema as MaintenanceRecordUpdateWithoutVendorInputObjectSchema } from './MaintenanceRecordUpdateWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutVendorInput.schema';
import { MaintenanceRecordCreateWithoutVendorInputObjectSchema as MaintenanceRecordCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
