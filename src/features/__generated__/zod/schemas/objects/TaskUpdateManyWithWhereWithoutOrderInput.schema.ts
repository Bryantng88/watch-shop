import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutOrderInputObjectSchema as TaskUncheckedUpdateManyWithoutOrderInputObjectSchema } from './TaskUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutOrderInput>;
export const TaskUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();
