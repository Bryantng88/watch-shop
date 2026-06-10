import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateWithoutCreatedByUserInput.schema';
import { TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutCreatedByUserInput.schema';
import { TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutCreatedByUserInput.schema';
import { TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema as TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema } from './TaskExecutionCreateManyCreatedByUserInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutCreatedByUserInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInput>;
export const TaskExecutionUncheckedCreateNestedManyWithoutCreatedByUserInputObjectZodSchema = makeSchema();
