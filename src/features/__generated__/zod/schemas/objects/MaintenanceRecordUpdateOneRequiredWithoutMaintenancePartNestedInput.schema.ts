import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUpsertWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUpsertWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUpsertWithoutMaintenancePartInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUpdateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema).optional(),
  upsert: z.lazy(() => MaintenanceRecordUpsertWithoutMaintenancePartInputObjectSchema).optional(),
  connect: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordUpdateOneRequiredWithoutMaintenancePartNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateOneRequiredWithoutMaintenancePartNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateOneRequiredWithoutMaintenancePartNestedInput>;
export const MaintenanceRecordUpdateOneRequiredWithoutMaintenancePartNestedInputObjectZodSchema = makeSchema();
