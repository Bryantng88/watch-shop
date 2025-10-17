import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceRequestInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceRequestInput.schema';
import { MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceRequestInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
