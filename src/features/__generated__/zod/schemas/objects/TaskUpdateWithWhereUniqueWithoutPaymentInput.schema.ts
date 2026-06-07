import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutPaymentInputObjectSchema as TaskUpdateWithoutPaymentInputObjectSchema } from './TaskUpdateWithoutPaymentInput.schema';
import { TaskUncheckedUpdateWithoutPaymentInputObjectSchema as TaskUncheckedUpdateWithoutPaymentInputObjectSchema } from './TaskUncheckedUpdateWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutPaymentInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutPaymentInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutPaymentInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutPaymentInput>;
export const TaskUpdateWithWhereUniqueWithoutPaymentInputObjectZodSchema = makeSchema();
