import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutServiceRequestInputObjectSchema as TaskCreateWithoutServiceRequestInputObjectSchema } from './TaskCreateWithoutServiceRequestInput.schema';
import { TaskUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutServiceRequestInput>;
export const TaskCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
