import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutCreatedByUserInputObjectSchema as TaskCreateWithoutCreatedByUserInputObjectSchema } from './TaskCreateWithoutCreatedByUserInput.schema';
import { TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCreatedByUserInput.schema';
import { TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema as TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema } from './TaskCreateOrConnectWithoutCreatedByUserInput.schema';
import { TaskCreateManyCreatedByUserInputEnvelopeObjectSchema as TaskCreateManyCreatedByUserInputEnvelopeObjectSchema } from './TaskCreateManyCreatedByUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskCreateWithoutCreatedByUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyCreatedByUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutCreatedByUserInput>;
export const TaskUncheckedCreateNestedManyWithoutCreatedByUserInputObjectZodSchema = makeSchema();
