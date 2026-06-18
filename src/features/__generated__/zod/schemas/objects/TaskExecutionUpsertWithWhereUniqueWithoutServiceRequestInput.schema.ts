import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutServiceRequestInputObjectSchema as TaskExecutionUpdateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUpdateWithoutServiceRequestInput.schema';
import { TaskExecutionUncheckedUpdateWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutServiceRequestInput.schema';
import { TaskExecutionCreateWithoutServiceRequestInputObjectSchema as TaskExecutionCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionCreateWithoutServiceRequestInput.schema';
import { TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInput>;
export const TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
