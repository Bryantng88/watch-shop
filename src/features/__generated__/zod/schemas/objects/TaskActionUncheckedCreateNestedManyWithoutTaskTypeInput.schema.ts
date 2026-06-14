import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutTaskTypeInputObjectSchema as TaskActionCreateWithoutTaskTypeInputObjectSchema } from './TaskActionCreateWithoutTaskTypeInput.schema';
import { TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedCreateWithoutTaskTypeInput.schema';
import { TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema as TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema } from './TaskActionCreateOrConnectWithoutTaskTypeInput.schema';
import { TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema as TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema } from './TaskActionCreateManyTaskTypeInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionCreateWithoutTaskTypeInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUncheckedCreateNestedManyWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskActionUncheckedCreateNestedManyWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUncheckedCreateNestedManyWithoutTaskTypeInput>;
export const TaskActionUncheckedCreateNestedManyWithoutTaskTypeInputObjectZodSchema = makeSchema();
