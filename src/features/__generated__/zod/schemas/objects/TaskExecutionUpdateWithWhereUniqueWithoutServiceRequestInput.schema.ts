import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutServiceRequestInputObjectSchema as TaskExecutionUpdateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUpdateWithoutServiceRequestInput.schema';
import { TaskExecutionUncheckedUpdateWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInput>;
export const TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
