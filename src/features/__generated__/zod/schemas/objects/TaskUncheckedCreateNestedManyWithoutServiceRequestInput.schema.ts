import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutServiceRequestInputObjectSchema as TaskCreateWithoutServiceRequestInputObjectSchema } from './TaskCreateWithoutServiceRequestInput.schema';
import { TaskUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskUncheckedCreateWithoutServiceRequestInput.schema';
import { TaskCreateOrConnectWithoutServiceRequestInputObjectSchema as TaskCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TaskCreateOrConnectWithoutServiceRequestInput.schema';
import { TaskCreateManyServiceRequestInputEnvelopeObjectSchema as TaskCreateManyServiceRequestInputEnvelopeObjectSchema } from './TaskCreateManyServiceRequestInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutServiceRequestInput>;
export const TaskUncheckedCreateNestedManyWithoutServiceRequestInputObjectZodSchema = makeSchema();
