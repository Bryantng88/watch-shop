import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTaskTypeInputObjectSchema as TaskCreateWithoutTaskTypeInputObjectSchema } from './TaskCreateWithoutTaskTypeInput.schema';
import { TaskUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskUncheckedCreateWithoutTaskTypeInput.schema';
import { TaskCreateOrConnectWithoutTaskTypeInputObjectSchema as TaskCreateOrConnectWithoutTaskTypeInputObjectSchema } from './TaskCreateOrConnectWithoutTaskTypeInput.schema';
import { TaskCreateManyTaskTypeInputEnvelopeObjectSchema as TaskCreateManyTaskTypeInputEnvelopeObjectSchema } from './TaskCreateManyTaskTypeInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskCreateWithoutTaskTypeInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskTypeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutTaskTypeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyTaskTypeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutTaskTypeInput>;
export const TaskUncheckedCreateNestedManyWithoutTaskTypeInputObjectZodSchema = makeSchema();
