import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartCreateWithoutRecordInputObjectSchema as MaintenancePartCreateWithoutRecordInputObjectSchema } from './MaintenancePartCreateWithoutRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema)])
}).strict();
export const MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutRecordInput>;
export const MaintenancePartCreateOrConnectWithoutRecordInputObjectZodSchema = makeSchema();
