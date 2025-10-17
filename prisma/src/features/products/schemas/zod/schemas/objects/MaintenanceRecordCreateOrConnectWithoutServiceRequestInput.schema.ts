import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceRequestInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutServiceRequestInput>;
export const MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
