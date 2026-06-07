import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutPaymentInputObjectSchema as TaskCreateWithoutPaymentInputObjectSchema } from './TaskCreateWithoutPaymentInput.schema';
import { TaskUncheckedCreateWithoutPaymentInputObjectSchema as TaskUncheckedCreateWithoutPaymentInputObjectSchema } from './TaskUncheckedCreateWithoutPaymentInput.schema';
import { TaskCreateOrConnectWithoutPaymentInputObjectSchema as TaskCreateOrConnectWithoutPaymentInputObjectSchema } from './TaskCreateOrConnectWithoutPaymentInput.schema';
import { TaskCreateManyPaymentInputEnvelopeObjectSchema as TaskCreateManyPaymentInputEnvelopeObjectSchema } from './TaskCreateManyPaymentInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutPaymentInputObjectSchema), z.lazy(() => TaskCreateWithoutPaymentInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutPaymentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutPaymentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutPaymentInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutPaymentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyPaymentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutPaymentInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutPaymentInput>;
export const TaskUncheckedCreateNestedManyWithoutPaymentInputObjectZodSchema = makeSchema();
