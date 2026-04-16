import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutVariantInputObjectSchema as MaintenanceRecordCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutVariantInput>;
export const MaintenanceRecordCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();
