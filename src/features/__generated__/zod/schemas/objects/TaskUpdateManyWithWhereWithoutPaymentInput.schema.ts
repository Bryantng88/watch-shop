import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutPaymentInputObjectSchema as TaskUncheckedUpdateManyWithoutPaymentInputObjectSchema } from './TaskUncheckedUpdateManyWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutPaymentInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutPaymentInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutPaymentInput>;
export const TaskUpdateManyWithWhereWithoutPaymentInputObjectZodSchema = makeSchema();
