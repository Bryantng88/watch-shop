import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutServiceRequestInputObjectSchema as TaskUpdateWithoutServiceRequestInputObjectSchema } from './TaskUpdateWithoutServiceRequestInput.schema';
import { TaskUncheckedUpdateWithoutServiceRequestInputObjectSchema as TaskUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TaskUncheckedUpdateWithoutServiceRequestInput.schema';
import { TaskCreateWithoutServiceRequestInputObjectSchema as TaskCreateWithoutServiceRequestInputObjectSchema } from './TaskCreateWithoutServiceRequestInput.schema';
import { TaskUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutServiceRequestInput>;
export const TaskUpsertWithWhereUniqueWithoutServiceRequestInputObjectZodSchema = makeSchema();
