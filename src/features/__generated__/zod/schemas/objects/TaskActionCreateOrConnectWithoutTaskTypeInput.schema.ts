import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionCreateWithoutTaskTypeInputObjectSchema as TaskActionCreateWithoutTaskTypeInputObjectSchema } from './TaskActionCreateWithoutTaskTypeInput.schema';
import { TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedCreateWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskActionCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskActionCreateOrConnectWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateOrConnectWithoutTaskTypeInput>;
export const TaskActionCreateOrConnectWithoutTaskTypeInputObjectZodSchema = makeSchema();
