import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutExecutionsInputObjectSchema as TaskCreateWithoutExecutionsInputObjectSchema } from './TaskCreateWithoutExecutionsInput.schema';
import { TaskUncheckedCreateWithoutExecutionsInputObjectSchema as TaskUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskUncheckedCreateWithoutExecutionsInput.schema';
import { TaskCreateOrConnectWithoutExecutionsInputObjectSchema as TaskCreateOrConnectWithoutExecutionsInputObjectSchema } from './TaskCreateOrConnectWithoutExecutionsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskCreateNestedOneWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskCreateNestedOneWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateNestedOneWithoutExecutionsInput>;
export const TaskCreateNestedOneWithoutExecutionsInputObjectZodSchema = makeSchema();
