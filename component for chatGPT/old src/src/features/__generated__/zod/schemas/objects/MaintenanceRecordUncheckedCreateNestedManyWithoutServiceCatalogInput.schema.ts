import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema as MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyServiceCatalogInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInput>;
export const MaintenanceRecordUncheckedCreateNestedManyWithoutServiceCatalogInputObjectZodSchema = makeSchema();
