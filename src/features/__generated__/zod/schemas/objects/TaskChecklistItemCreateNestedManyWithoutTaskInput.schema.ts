import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutTaskInputObjectSchema as TaskChecklistItemCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateWithoutTaskInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutTaskInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutTaskInput.schema';
import { TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema as TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema } from './TaskChecklistItemCreateManyTaskInputEnvelope.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskChecklistItemCreateNestedManyWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateNestedManyWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateNestedManyWithoutTaskInput>;
export const TaskChecklistItemCreateNestedManyWithoutTaskInputObjectZodSchema = makeSchema();
