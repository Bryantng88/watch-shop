import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutServiceRequestInputObjectSchema as TaskUpdateWithoutServiceRequestInputObjectSchema } from './TaskUpdateWithoutServiceRequestInput.schema';
import { TaskUncheckedUpdateWithoutServiceRequestInputObjectSchema as TaskUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TaskUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutServiceRequestInput>;
export const TaskUpdateWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
