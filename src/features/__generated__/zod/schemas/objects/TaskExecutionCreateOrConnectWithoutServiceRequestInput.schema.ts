import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateWithoutServiceRequestInputObjectSchema as TaskExecutionCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionCreateWithoutServiceRequestInput.schema';
import { TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutServiceRequestInput>;
export const TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
