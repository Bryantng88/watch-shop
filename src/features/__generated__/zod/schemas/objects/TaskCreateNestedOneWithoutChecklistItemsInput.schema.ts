import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutChecklistItemsInputObjectSchema as TaskCreateWithoutChecklistItemsInputObjectSchema } from './TaskCreateWithoutChecklistItemsInput.schema';
import { TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema as TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedCreateWithoutChecklistItemsInput.schema';
import { TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema as TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema } from './TaskCreateOrConnectWithoutChecklistItemsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema: z.ZodType<Prisma.TaskCreateNestedOneWithoutChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateNestedOneWithoutChecklistItemsInput>;
export const TaskCreateNestedOneWithoutChecklistItemsInputObjectZodSchema = makeSchema();
