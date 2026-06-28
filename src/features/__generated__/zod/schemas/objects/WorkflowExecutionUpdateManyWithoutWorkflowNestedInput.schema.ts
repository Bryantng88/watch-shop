import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutWorkflowInput.schema';
import { WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateOrConnectWithoutWorkflowInput.schema';
import { WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema as WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInput.schema';
import { WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema as WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema } from './WorkflowExecutionCreateManyWorkflowInputEnvelope.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema as WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInput.schema';
import { WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInputObjectSchema as WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInput.schema';
import { WorkflowExecutionScalarWhereInputObjectSchema as WorkflowExecutionScalarWhereInputObjectSchema } from './WorkflowExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionCreateWithoutWorkflowInputObjectSchema).array(), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowExecutionUpdateManyWithoutWorkflowNestedInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpdateManyWithoutWorkflowNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpdateManyWithoutWorkflowNestedInput>;
export const WorkflowExecutionUpdateManyWithoutWorkflowNestedInputObjectZodSchema = makeSchema();
