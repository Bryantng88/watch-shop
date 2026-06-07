import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutAcquisitionInputObjectSchema as TaskCreateWithoutAcquisitionInputObjectSchema } from './TaskCreateWithoutAcquisitionInput.schema';
import { TaskUncheckedCreateWithoutAcquisitionInputObjectSchema as TaskUncheckedCreateWithoutAcquisitionInputObjectSchema } from './TaskUncheckedCreateWithoutAcquisitionInput.schema';
import { TaskCreateOrConnectWithoutAcquisitionInputObjectSchema as TaskCreateOrConnectWithoutAcquisitionInputObjectSchema } from './TaskCreateOrConnectWithoutAcquisitionInput.schema';
import { TaskCreateManyAcquisitionInputEnvelopeObjectSchema as TaskCreateManyAcquisitionInputEnvelopeObjectSchema } from './TaskCreateManyAcquisitionInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskCreateWithoutAcquisitionInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAcquisitionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutAcquisitionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyAcquisitionInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutAcquisitionInput>;
export const TaskUncheckedCreateNestedManyWithoutAcquisitionInputObjectZodSchema = makeSchema();
