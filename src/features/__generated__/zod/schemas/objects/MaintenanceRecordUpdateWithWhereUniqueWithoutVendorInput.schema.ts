import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutVendorInputObjectSchema as MaintenanceRecordUpdateWithoutVendorInputObjectSchema } from './MaintenanceRecordUpdateWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
