import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutChecklistsInputObjectSchema as TaskItemCreateWithoutChecklistsInputObjectSchema } from './TaskItemCreateWithoutChecklistsInput.schema';
import { TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema as TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedCreateWithoutChecklistsInput.schema';
import { TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema as TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema } from './TaskItemCreateOrConnectWithoutChecklistsInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema: z.ZodType<Prisma.TaskItemCreateNestedOneWithoutChecklistsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateNestedOneWithoutChecklistsInput>;
export const TaskItemCreateNestedOneWithoutChecklistsInputObjectZodSchema = makeSchema();
