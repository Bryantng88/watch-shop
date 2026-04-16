import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema as MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyServiceCatalogInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogNestedInput>;
export const MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectZodSchema = makeSchema();
