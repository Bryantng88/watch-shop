import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTaskActionInputObjectSchema as TaskCreateWithoutTaskActionInputObjectSchema } from './TaskCreateWithoutTaskActionInput.schema';
import { TaskUncheckedCreateWithoutTaskActionInputObjectSchema as TaskUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskUncheckedCreateWithoutTaskActionInput.schema';
import { TaskCreateOrConnectWithoutTaskActionInputObjectSchema as TaskCreateOrConnectWithoutTaskActionInputObjectSchema } from './TaskCreateOrConnectWithoutTaskActionInput.schema';
import { TaskCreateManyTaskActionInputEnvelopeObjectSchema as TaskCreateManyTaskActionInputEnvelopeObjectSchema } from './TaskCreateManyTaskActionInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskCreateWithoutTaskActionInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskActionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutTaskActionInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutTaskActionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyTaskActionInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutTaskActionInput>;
export const TaskUncheckedCreateNestedManyWithoutTaskActionInputObjectZodSchema = makeSchema();
