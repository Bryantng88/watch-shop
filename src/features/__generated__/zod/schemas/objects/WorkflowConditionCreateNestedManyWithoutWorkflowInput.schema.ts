import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionCreateWithoutWorkflowInputObjectSchema as WorkflowConditionCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateWithoutWorkflowInput.schema';
import { WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedCreateWithoutWorkflowInput.schema';
import { WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema as WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateOrConnectWithoutWorkflowInput.schema';
import { WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema as WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema } from './WorkflowConditionCreateManyWorkflowInputEnvelope.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './WorkflowConditionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowConditionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionCreateWithoutWorkflowInputObjectSchema).array(), z.lazy(() => WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowConditionCreateNestedManyWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowConditionCreateNestedManyWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionCreateNestedManyWithoutWorkflowInput>;
export const WorkflowConditionCreateNestedManyWithoutWorkflowInputObjectZodSchema = makeSchema();
