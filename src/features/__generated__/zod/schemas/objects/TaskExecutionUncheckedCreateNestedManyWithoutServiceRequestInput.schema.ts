import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutServiceRequestInputObjectSchema as TaskExecutionCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionCreateWithoutServiceRequestInput.schema';
import { TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutServiceRequestInput.schema';
import { TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema as TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutServiceRequestInput.schema';
import { TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema as TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema } from './TaskExecutionCreateManyServiceRequestInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUncheckedCreateNestedManyWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedCreateNestedManyWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedCreateNestedManyWithoutServiceRequestInput>;
export const TaskExecutionUncheckedCreateNestedManyWithoutServiceRequestInputObjectZodSchema = makeSchema();
