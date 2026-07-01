import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActorUserInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActorUserInput.schema';
import { TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateOrConnectWithoutActorUserInput.schema';
import { TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInputObjectSchema as TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInput.schema';
import { TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema as TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema } from './TaskItemActivityReplyCreateManyActorUserInputEnvelope.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInputObjectSchema as TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInput.schema';
import { TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInputObjectSchema as TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInput.schema';
import { TaskItemActivityReplyScalarWhereInputObjectSchema as TaskItemActivityReplyScalarWhereInputObjectSchema } from './TaskItemActivityReplyScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema).array(), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInput>;
export const TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserNestedInputObjectZodSchema = makeSchema();
