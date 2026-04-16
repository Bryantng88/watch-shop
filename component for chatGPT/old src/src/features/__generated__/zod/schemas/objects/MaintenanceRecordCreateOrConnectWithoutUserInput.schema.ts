import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutUserInputObjectSchema as MaintenanceRecordCreateWithoutUserInputObjectSchema } from './MaintenanceRecordCreateWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutUserInput>;
export const MaintenanceRecordCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
