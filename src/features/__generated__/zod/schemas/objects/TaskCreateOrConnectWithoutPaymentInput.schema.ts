import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutPaymentInputObjectSchema as TaskCreateWithoutPaymentInputObjectSchema } from './TaskCreateWithoutPaymentInput.schema';
import { TaskUncheckedCreateWithoutPaymentInputObjectSchema as TaskUncheckedCreateWithoutPaymentInputObjectSchema } from './TaskUncheckedCreateWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutPaymentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutPaymentInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutPaymentInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutPaymentInput>;
export const TaskCreateOrConnectWithoutPaymentInputObjectZodSchema = makeSchema();
