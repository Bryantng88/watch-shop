import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskItemInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskItemInput.schema';
import { TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateOrConnectWithoutTaskItemInput.schema';
import { TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema as TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema } from './TaskItemChecklistCreateManyTaskItemInputEnvelope.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistCreateWithoutTaskItemInputObjectSchema).array(), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInput>;
export const TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInputObjectZodSchema = makeSchema();
