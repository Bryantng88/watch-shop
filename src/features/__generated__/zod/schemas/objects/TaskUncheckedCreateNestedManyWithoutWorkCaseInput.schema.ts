import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutWorkCaseInputObjectSchema as TaskCreateWithoutWorkCaseInputObjectSchema } from './TaskCreateWithoutWorkCaseInput.schema';
import { TaskUncheckedCreateWithoutWorkCaseInputObjectSchema as TaskUncheckedCreateWithoutWorkCaseInputObjectSchema } from './TaskUncheckedCreateWithoutWorkCaseInput.schema';
import { TaskCreateOrConnectWithoutWorkCaseInputObjectSchema as TaskCreateOrConnectWithoutWorkCaseInputObjectSchema } from './TaskCreateOrConnectWithoutWorkCaseInput.schema';
import { TaskCreateManyWorkCaseInputEnvelopeObjectSchema as TaskCreateManyWorkCaseInputEnvelopeObjectSchema } from './TaskCreateManyWorkCaseInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskCreateWithoutWorkCaseInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWorkCaseInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutWorkCaseInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyWorkCaseInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutWorkCaseInput>;
export const TaskUncheckedCreateNestedManyWithoutWorkCaseInputObjectZodSchema = makeSchema();
