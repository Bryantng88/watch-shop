import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutServiceRequestInputObjectSchema as TaskUncheckedUpdateManyWithoutServiceRequestInputObjectSchema } from './TaskUncheckedUpdateManyWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutServiceRequestInput>;
export const TaskUpdateManyWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
