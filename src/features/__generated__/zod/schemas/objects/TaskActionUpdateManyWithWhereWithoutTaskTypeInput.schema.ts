import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './TaskActionUpdateManyMutationInput.schema';
import { TaskActionUncheckedUpdateManyWithoutTaskTypeInputObjectSchema as TaskActionUncheckedUpdateManyWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedUpdateManyWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateManyWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskActionUpdateManyWithWhereWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithWhereWithoutTaskTypeInput>;
export const TaskActionUpdateManyWithWhereWithoutTaskTypeInputObjectZodSchema = makeSchema();
