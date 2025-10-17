import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema as ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema } from './ServiceCatalogCreateManyMaintenanceRecordInputEnvelope.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogScalarWhereInputObjectSchema as ServiceCatalogScalarWhereInputObjectSchema } from './ServiceCatalogScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogCreateWithoutMaintenanceRecordInputObjectSchema).array(), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUncheckedCreateWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ServiceCatalogCreateManyMaintenanceRecordInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema), z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema), z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema), z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema), z.lazy(() => ServiceCatalogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => ServiceCatalogUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema), z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInput>;
export const ServiceCatalogUpdateManyWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
