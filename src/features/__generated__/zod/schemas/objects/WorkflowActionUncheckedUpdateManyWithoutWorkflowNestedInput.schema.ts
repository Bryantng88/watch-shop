import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionCreateWithoutWorkflowInputObjectSchema as WorkflowActionCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedCreateWithoutWorkflowInput.schema';
import { WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema as WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateOrConnectWithoutWorkflowInput.schema';
import { WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema as WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema } from './WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInput.schema';
import { WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema as WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema } from './WorkflowActionCreateManyWorkflowInputEnvelope.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema as WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema } from './WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInput.schema';
import { WorkflowActionUpdateManyWithWhereWithoutWorkflowInputObjectSchema as WorkflowActionUpdateManyWithWhereWithoutWorkflowInputObjectSchema } from './WorkflowActionUpdateManyWithWhereWithoutWorkflowInput.schema';
import { WorkflowActionScalarWhereInputObjectSchema as WorkflowActionScalarWhereInputObjectSchema } from './WorkflowActionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowActionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionCreateWithoutWorkflowInputObjectSchema).array(), z.lazy(() => WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkflowActionUpdateManyWithWhereWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUpdateManyWithWhereWithoutWorkflowInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkflowActionScalarWhereInputObjectSchema), z.lazy(() => WorkflowActionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema: z.ZodType<Prisma.WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInput>;
export const WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInputObjectZodSchema = makeSchema();
