import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutShipmentInputObjectSchema as TaskCreateWithoutShipmentInputObjectSchema } from './TaskCreateWithoutShipmentInput.schema';
import { TaskUncheckedCreateWithoutShipmentInputObjectSchema as TaskUncheckedCreateWithoutShipmentInputObjectSchema } from './TaskUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutShipmentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutShipmentInput>;
export const TaskCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
