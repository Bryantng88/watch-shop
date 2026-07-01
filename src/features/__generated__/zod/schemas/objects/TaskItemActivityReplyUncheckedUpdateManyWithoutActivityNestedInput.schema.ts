import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActivityInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActivityInput.schema';
import { TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateOrConnectWithoutActivityInput.schema';
import { TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInputObjectSchema as TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInput.schema';
import { TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema as TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema } from './TaskItemActivityReplyCreateManyActivityInputEnvelope.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInputObjectSchema as TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInput.schema';
import { TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInputObjectSchema as TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInput.schema';
import { TaskItemActivityReplyScalarWhereInputObjectSchema as TaskItemActivityReplyScalarWhereInputObjectSchema } from './TaskItemActivityReplyScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateWithoutActivityInputObjectSchema).array(), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityReplyUncheckedUpdateManyWithoutActivityNestedInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUncheckedUpdateManyWithoutActivityNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUncheckedUpdateManyWithoutActivityNestedInput>;
export const TaskItemActivityReplyUncheckedUpdateManyWithoutActivityNestedInputObjectZodSchema = makeSchema();
