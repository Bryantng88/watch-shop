import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutServiceDetailInput.schema';
import { MaintenanceRecordUpsertWithoutServiceDetailInputObjectSchema as MaintenanceRecordUpsertWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUpsertWithoutServiceDetailInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInputObjectSchema as MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInput.schema';
import { MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceDetailInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema).optional(),
  upsert: z.lazy(() => MaintenanceRecordUpsertWithoutServiceDetailInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => MaintenanceRecordWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => MaintenanceRecordWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordUpdateOneWithoutServiceDetailNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateOneWithoutServiceDetailNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateOneWithoutServiceDetailNestedInput>;
export const MaintenanceRecordUpdateOneWithoutServiceDetailNestedInputObjectZodSchema = makeSchema();
