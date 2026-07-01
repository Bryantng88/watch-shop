import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActivityInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActivityInput.schema';
import { TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateOrConnectWithoutActivityInput.schema';
import { TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema as TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema } from './TaskItemActivityReplyCreateManyActivityInputEnvelope.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateWithoutActivityInputObjectSchema).array(), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityReplyCreateNestedManyWithoutActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateNestedManyWithoutActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateNestedManyWithoutActivityInput>;
export const TaskItemActivityReplyCreateNestedManyWithoutActivityInputObjectZodSchema = makeSchema();
