import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutOrderInputObjectSchema as TaskCreateWithoutOrderInputObjectSchema } from './TaskCreateWithoutOrderInput.schema';
import { TaskUncheckedCreateWithoutOrderInputObjectSchema as TaskUncheckedCreateWithoutOrderInputObjectSchema } from './TaskUncheckedCreateWithoutOrderInput.schema';
import { TaskCreateOrConnectWithoutOrderInputObjectSchema as TaskCreateOrConnectWithoutOrderInputObjectSchema } from './TaskCreateOrConnectWithoutOrderInput.schema';
import { TaskCreateManyOrderInputEnvelopeObjectSchema as TaskCreateManyOrderInputEnvelopeObjectSchema } from './TaskCreateManyOrderInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutOrderInputObjectSchema), z.lazy(() => TaskCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutOrderInput>;
export const TaskUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();
