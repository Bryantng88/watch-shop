import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActorUserInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActorUserInput.schema';
import { TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateOrConnectWithoutActorUserInput.schema';
import { TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema as TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema } from './TaskItemActivityReplyCreateManyActorUserInputEnvelope.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema).array(), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityReplyUncheckedCreateNestedManyWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUncheckedCreateNestedManyWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUncheckedCreateNestedManyWithoutActorUserInput>;
export const TaskItemActivityReplyUncheckedCreateNestedManyWithoutActorUserInputObjectZodSchema = makeSchema();
