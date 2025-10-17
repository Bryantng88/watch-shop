import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceRequestInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
