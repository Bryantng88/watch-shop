import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateWithoutExecutionInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutExecutionInput.schema';
import { WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateOrConnectWithoutExecutionInput.schema';
import { WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInputObjectSchema as WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInput.schema';
import { WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema as WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema } from './WorkflowExecutionEventCreateManyExecutionInputEnvelope.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInputObjectSchema as WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInput.schema';
import { WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInputObjectSchema as WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInput.schema';
import { WorkflowExecutionEventScalarWhereInputObjectSchema as WorkflowExecutionEventScalarWhereInputObjectSchema } from './WorkflowExecutionEventScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema).array(), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInput>;
export const WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionNestedInputObjectZodSchema = makeSchema();
