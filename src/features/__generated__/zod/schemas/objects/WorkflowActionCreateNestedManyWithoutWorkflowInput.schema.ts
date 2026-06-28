import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionCreateWithoutWorkflowInputObjectSchema as WorkflowActionCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedCreateWithoutWorkflowInput.schema';
import { WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema as WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateOrConnectWithoutWorkflowInput.schema';
import { WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema as WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema } from './WorkflowActionCreateManyWorkflowInputEnvelope.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './WorkflowActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowActionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionCreateWithoutWorkflowInputObjectSchema).array(), z.lazy(() => WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowActionCreateNestedManyWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowActionCreateNestedManyWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionCreateNestedManyWithoutWorkflowInput>;
export const WorkflowActionCreateNestedManyWithoutWorkflowInputObjectZodSchema = makeSchema();
