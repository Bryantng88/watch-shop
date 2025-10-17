import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutVendorInputObjectSchema as MaintenanceRecordCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutVendorInput>;
export const MaintenanceRecordCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
