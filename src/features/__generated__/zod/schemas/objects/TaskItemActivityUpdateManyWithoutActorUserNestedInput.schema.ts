import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateWithoutActorUserInputObjectSchema as TaskItemActivityCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateWithoutActorUserInput.schema';
import { TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutActorUserInput.schema';
import { TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema as TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateOrConnectWithoutActorUserInput.schema';
import { TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInputObjectSchema as TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInputObjectSchema } from './TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInput.schema';
import { TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema as TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema } from './TaskItemActivityCreateManyActorUserInputEnvelope.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInputObjectSchema as TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInputObjectSchema } from './TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInput.schema';
import { TaskItemActivityUpdateManyWithWhereWithoutActorUserInputObjectSchema as TaskItemActivityUpdateManyWithWhereWithoutActorUserInputObjectSchema } from './TaskItemActivityUpdateManyWithWhereWithoutActorUserInput.schema';
import { TaskItemActivityScalarWhereInputObjectSchema as TaskItemActivityScalarWhereInputObjectSchema } from './TaskItemActivityScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityCreateWithoutActorUserInputObjectSchema).array(), z.lazy(() => TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemActivityUpdateManyWithWhereWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUpdateManyWithWhereWithoutActorUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityUpdateManyWithoutActorUserNestedInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateManyWithoutActorUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateManyWithoutActorUserNestedInput>;
export const TaskItemActivityUpdateManyWithoutActorUserNestedInputObjectZodSchema = makeSchema();
