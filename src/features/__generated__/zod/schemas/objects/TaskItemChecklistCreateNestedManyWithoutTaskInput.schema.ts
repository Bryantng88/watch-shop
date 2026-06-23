import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistCreateWithoutTaskInputObjectSchema as TaskItemChecklistCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskInput.schema';
import { TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema as TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema } from './TaskItemChecklistCreateOrConnectWithoutTaskInput.schema';
import { TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema as TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema } from './TaskItemChecklistCreateManyTaskInputEnvelope.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemChecklistCreateNestedManyWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateNestedManyWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateNestedManyWithoutTaskInput>;
export const TaskItemChecklistCreateNestedManyWithoutTaskInputObjectZodSchema = makeSchema();
