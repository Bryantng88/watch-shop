import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutWatchInputObjectSchema as TaskCreateWithoutWatchInputObjectSchema } from './TaskCreateWithoutWatchInput.schema';
import { TaskUncheckedCreateWithoutWatchInputObjectSchema as TaskUncheckedCreateWithoutWatchInputObjectSchema } from './TaskUncheckedCreateWithoutWatchInput.schema';
import { TaskCreateOrConnectWithoutWatchInputObjectSchema as TaskCreateOrConnectWithoutWatchInputObjectSchema } from './TaskCreateOrConnectWithoutWatchInput.schema';
import { TaskCreateManyWatchInputEnvelopeObjectSchema as TaskCreateManyWatchInputEnvelopeObjectSchema } from './TaskCreateManyWatchInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutWatchInputObjectSchema), z.lazy(() => TaskCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyWatchInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskCreateNestedManyWithoutWatchInputObjectSchema: z.ZodType<Prisma.TaskCreateNestedManyWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateNestedManyWithoutWatchInput>;
export const TaskCreateNestedManyWithoutWatchInputObjectZodSchema = makeSchema();
