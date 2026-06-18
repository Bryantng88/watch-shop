import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema)])
}).strict();
export const TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutExecutionsInput>;
export const TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectZodSchema = makeSchema();
