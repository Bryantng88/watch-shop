import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutUserInputObjectSchema as TaskChecklistItemCreateWithoutUserInputObjectSchema } from './TaskChecklistItemCreateWithoutUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutUserInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutUserInput.schema';
import { TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema as TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema } from './TaskChecklistItemCreateManyUserInputEnvelope.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateWithoutUserInputObjectSchema).array(), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskChecklistItemUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUncheckedCreateNestedManyWithoutUserInput>;
export const TaskChecklistItemUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
