import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutAcquisitionInputObjectSchema as TaskUncheckedUpdateManyWithoutAcquisitionInputObjectSchema } from './TaskUncheckedUpdateManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutAcquisitionInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutAcquisitionInput>;
export const TaskUpdateManyWithWhereWithoutAcquisitionInputObjectZodSchema = makeSchema();
