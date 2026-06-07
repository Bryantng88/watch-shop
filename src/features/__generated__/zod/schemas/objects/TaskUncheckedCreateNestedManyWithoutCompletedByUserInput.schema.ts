import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutCompletedByUserInputObjectSchema as TaskCreateWithoutCompletedByUserInputObjectSchema } from './TaskCreateWithoutCompletedByUserInput.schema';
import { TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema as TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCompletedByUserInput.schema';
import { TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema as TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema } from './TaskCreateOrConnectWithoutCompletedByUserInput.schema';
import { TaskCreateManyCompletedByUserInputEnvelopeObjectSchema as TaskCreateManyCompletedByUserInputEnvelopeObjectSchema } from './TaskCreateManyCompletedByUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskCreateWithoutCompletedByUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyCompletedByUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutCompletedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutCompletedByUserInput>;
export const TaskUncheckedCreateNestedManyWithoutCompletedByUserInputObjectZodSchema = makeSchema();
