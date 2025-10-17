import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutVendorInputObjectSchema as MaintenanceRecordCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVendorInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutVendorInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInput.schema';
import { MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema as MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyVendorInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutVendorInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutVendorInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutVendorInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInput>;
export const MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();
