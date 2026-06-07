import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutPaymentInputObjectSchema as TaskUpdateWithoutPaymentInputObjectSchema } from './TaskUpdateWithoutPaymentInput.schema';
import { TaskUncheckedUpdateWithoutPaymentInputObjectSchema as TaskUncheckedUpdateWithoutPaymentInputObjectSchema } from './TaskUncheckedUpdateWithoutPaymentInput.schema';
import { TaskCreateWithoutPaymentInputObjectSchema as TaskCreateWithoutPaymentInputObjectSchema } from './TaskCreateWithoutPaymentInput.schema';
import { TaskUncheckedCreateWithoutPaymentInputObjectSchema as TaskUncheckedCreateWithoutPaymentInputObjectSchema } from './TaskUncheckedCreateWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutPaymentInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutPaymentInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutPaymentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutPaymentInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutPaymentInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutPaymentInput>;
export const TaskUpsertWithWhereUniqueWithoutPaymentInputObjectZodSchema = makeSchema();
