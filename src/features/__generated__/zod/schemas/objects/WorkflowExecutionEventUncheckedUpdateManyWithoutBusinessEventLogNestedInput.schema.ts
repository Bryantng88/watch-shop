import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema as WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema } from './WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelope.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventScalarWhereInputObjectSchema as WorkflowExecutionEventScalarWhereInputObjectSchema } from './WorkflowExecutionEventScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema).array(), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInput>;
export const WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogNestedInputObjectZodSchema = makeSchema();
