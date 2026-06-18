import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutChecklistItemInputObjectSchema as TaskExecutionCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateWithoutChecklistItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutChecklistItemInput.schema';
import { TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema as TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutChecklistItemInput.schema';
import { TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema as TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema } from './TaskExecutionCreateManyChecklistItemInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutChecklistItemInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateNestedManyWithoutChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateNestedManyWithoutChecklistItemInput>;
export const TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectZodSchema = makeSchema();
