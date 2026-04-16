import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutProductVariantInputObjectSchema as MaintenanceRecordCreateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutProductVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutProductVariantInput>;
export const MaintenanceRecordCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
