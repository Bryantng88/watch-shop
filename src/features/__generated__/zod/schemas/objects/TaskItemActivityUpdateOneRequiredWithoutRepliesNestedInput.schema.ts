import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateWithoutRepliesInputObjectSchema as TaskItemActivityCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutRepliesInput.schema';
import { TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema as TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateOrConnectWithoutRepliesInput.schema';
import { TaskItemActivityUpsertWithoutRepliesInputObjectSchema as TaskItemActivityUpsertWithoutRepliesInputObjectSchema } from './TaskItemActivityUpsertWithoutRepliesInput.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateToOneWithWhereWithoutRepliesInputObjectSchema as TaskItemActivityUpdateToOneWithWhereWithoutRepliesInputObjectSchema } from './TaskItemActivityUpdateToOneWithWhereWithoutRepliesInput.schema';
import { TaskItemActivityUpdateWithoutRepliesInputObjectSchema as TaskItemActivityUpdateWithoutRepliesInputObjectSchema } from './TaskItemActivityUpdateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutRepliesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskItemActivityUpsertWithoutRepliesInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskItemActivityUpdateToOneWithWhereWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUpdateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema)]).optional()
}).strict();
export const TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInput>;
export const TaskItemActivityUpdateOneRequiredWithoutRepliesNestedInputObjectZodSchema = makeSchema();
