import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutWorkflowInput.schema';
import { WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateOrConnectWithoutWorkflowInput.schema';
import { WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema as WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema } from './WorkflowExecutionCreateManyWorkflowInputEnvelope.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionCreateWithoutWorkflowInputObjectSchema).array(), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowExecutionCreateNestedManyWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateNestedManyWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateNestedManyWithoutWorkflowInput>;
export const WorkflowExecutionCreateNestedManyWithoutWorkflowInputObjectZodSchema = makeSchema();
