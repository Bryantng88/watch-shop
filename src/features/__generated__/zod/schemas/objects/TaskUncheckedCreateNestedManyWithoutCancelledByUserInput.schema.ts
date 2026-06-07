import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutCancelledByUserInputObjectSchema as TaskCreateWithoutCancelledByUserInputObjectSchema } from './TaskCreateWithoutCancelledByUserInput.schema';
import { TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema as TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCancelledByUserInput.schema';
import { TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema as TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema } from './TaskCreateOrConnectWithoutCancelledByUserInput.schema';
import { TaskCreateManyCancelledByUserInputEnvelopeObjectSchema as TaskCreateManyCancelledByUserInputEnvelopeObjectSchema } from './TaskCreateManyCancelledByUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskCreateWithoutCancelledByUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyCancelledByUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutCancelledByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutCancelledByUserInput>;
export const TaskUncheckedCreateNestedManyWithoutCancelledByUserInputObjectZodSchema = makeSchema();
