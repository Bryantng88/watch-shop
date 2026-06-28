import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateWithoutExecutionInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutExecutionInput.schema';
import { WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateOrConnectWithoutExecutionInput.schema';
import { WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema as WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema } from './WorkflowExecutionEventCreateManyExecutionInputEnvelope.schema';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema).array(), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowExecutionEventCreateNestedManyWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateNestedManyWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateNestedManyWithoutExecutionInput>;
export const WorkflowExecutionEventCreateNestedManyWithoutExecutionInputObjectZodSchema = makeSchema();
