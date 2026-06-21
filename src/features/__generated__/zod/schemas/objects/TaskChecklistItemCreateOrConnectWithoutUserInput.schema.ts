import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemCreateWithoutUserInputObjectSchema as TaskChecklistItemCreateWithoutUserInputObjectSchema } from './TaskChecklistItemCreateWithoutUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutUserInput>;
export const TaskChecklistItemCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
