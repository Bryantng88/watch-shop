import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutVendorInputObjectSchema as MaintenanceRecordCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVendorInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutVendorInput.schema';
import { MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema as MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyVendorInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInput>;
export const MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();
