import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutPartsInputObjectSchema as MaintenanceRecordCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPartsInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutPartsInput.schema';
import { MaintenanceRecordUpsertWithoutPartsInputObjectSchema as MaintenanceRecordUpsertWithoutPartsInputObjectSchema } from './MaintenanceRecordUpsertWithoutPartsInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateToOneWithWhereWithoutPartsInputObjectSchema as MaintenanceRecordUpdateToOneWithWhereWithoutPartsInputObjectSchema } from './MaintenanceRecordUpdateToOneWithWhereWithoutPartsInput.schema';
import { MaintenanceRecordUpdateWithoutPartsInputObjectSchema as MaintenanceRecordUpdateWithoutPartsInputObjectSchema } from './MaintenanceRecordUpdateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutPartsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema).optional(),
  upsert: z.lazy(() => MaintenanceRecordUpsertWithoutPartsInputObjectSchema).optional(),
  connect: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateToOneWithWhereWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordUpdateOneRequiredWithoutPartsNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateOneRequiredWithoutPartsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateOneRequiredWithoutPartsNestedInput>;
export const MaintenanceRecordUpdateOneRequiredWithoutPartsNestedInputObjectZodSchema = makeSchema();
