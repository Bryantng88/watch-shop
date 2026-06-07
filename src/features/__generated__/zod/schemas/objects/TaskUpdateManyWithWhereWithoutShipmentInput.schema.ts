import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutShipmentInputObjectSchema as TaskUncheckedUpdateManyWithoutShipmentInputObjectSchema } from './TaskUncheckedUpdateManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutShipmentInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutShipmentInput>;
export const TaskUpdateManyWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
