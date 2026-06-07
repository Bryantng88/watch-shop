import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutShipmentInputObjectSchema as TaskUpdateWithoutShipmentInputObjectSchema } from './TaskUpdateWithoutShipmentInput.schema';
import { TaskUncheckedUpdateWithoutShipmentInputObjectSchema as TaskUncheckedUpdateWithoutShipmentInputObjectSchema } from './TaskUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutShipmentInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutShipmentInput>;
export const TaskUpdateWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
