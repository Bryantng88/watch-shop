import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema as WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema } from './WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelope.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema).array(), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowExecutionEventCreateNestedManyWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateNestedManyWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateNestedManyWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventCreateNestedManyWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
