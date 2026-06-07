import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutOrderInputObjectSchema as TaskCreateWithoutOrderInputObjectSchema } from './TaskCreateWithoutOrderInput.schema';
import { TaskUncheckedCreateWithoutOrderInputObjectSchema as TaskUncheckedCreateWithoutOrderInputObjectSchema } from './TaskUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutOrderInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutOrderInput>;
export const TaskCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
