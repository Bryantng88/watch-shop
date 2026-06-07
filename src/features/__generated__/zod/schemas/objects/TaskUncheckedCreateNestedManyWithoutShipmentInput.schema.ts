import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutShipmentInputObjectSchema as TaskCreateWithoutShipmentInputObjectSchema } from './TaskCreateWithoutShipmentInput.schema';
import { TaskUncheckedCreateWithoutShipmentInputObjectSchema as TaskUncheckedCreateWithoutShipmentInputObjectSchema } from './TaskUncheckedCreateWithoutShipmentInput.schema';
import { TaskCreateOrConnectWithoutShipmentInputObjectSchema as TaskCreateOrConnectWithoutShipmentInputObjectSchema } from './TaskCreateOrConnectWithoutShipmentInput.schema';
import { TaskCreateManyShipmentInputEnvelopeObjectSchema as TaskCreateManyShipmentInputEnvelopeObjectSchema } from './TaskCreateManyShipmentInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutShipmentInputObjectSchema), z.lazy(() => TaskCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutShipmentInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutShipmentInput>;
export const TaskUncheckedCreateNestedManyWithoutShipmentInputObjectZodSchema = makeSchema();
