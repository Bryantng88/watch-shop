import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateWithoutTaskItemInputObjectSchema as TaskItemActivityCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateWithoutTaskItemInput.schema';
import { TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutTaskItemInput.schema';
import { TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema as TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateOrConnectWithoutTaskItemInput.schema';
import { TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema as TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema } from './TaskItemActivityCreateManyTaskItemInputEnvelope.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityCreateWithoutTaskItemInputObjectSchema).array(), z.lazy(() => TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityCreateNestedManyWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateNestedManyWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateNestedManyWithoutTaskItemInput>;
export const TaskItemActivityCreateNestedManyWithoutTaskItemInputObjectZodSchema = makeSchema();
