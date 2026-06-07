import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutShipmentInputObjectSchema as TaskUpdateWithoutShipmentInputObjectSchema } from './TaskUpdateWithoutShipmentInput.schema';
import { TaskUncheckedUpdateWithoutShipmentInputObjectSchema as TaskUncheckedUpdateWithoutShipmentInputObjectSchema } from './TaskUncheckedUpdateWithoutShipmentInput.schema';
import { TaskCreateWithoutShipmentInputObjectSchema as TaskCreateWithoutShipmentInputObjectSchema } from './TaskCreateWithoutShipmentInput.schema';
import { TaskUncheckedCreateWithoutShipmentInputObjectSchema as TaskUncheckedCreateWithoutShipmentInputObjectSchema } from './TaskUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutShipmentInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutShipmentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutShipmentInput>;
export const TaskUpsertWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
