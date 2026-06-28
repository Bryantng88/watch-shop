import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionCreateWithoutWorkflowInputObjectSchema as WorkflowConditionCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateWithoutWorkflowInput.schema';
import { WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedCreateWithoutWorkflowInput.schema';
import { WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema as WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateOrConnectWithoutWorkflowInput.schema';
import { WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema as WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema } from './WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInput.schema';
import { WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema as WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema } from './WorkflowConditionCreateManyWorkflowInputEnvelope.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema as WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema } from './WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInput.schema';
import { WorkflowConditionUpdateManyWithWhereWithoutWorkflowInputObjectSchema as WorkflowConditionUpdateManyWithWhereWithoutWorkflowInputObjectSchema } from './WorkflowConditionUpdateManyWithWhereWithoutWorkflowInput.schema';
import { WorkflowConditionScalarWhereInputObjectSchema as WorkflowConditionScalarWhereInputObjectSchema } from './WorkflowConditionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowConditionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionCreateWithoutWorkflowInputObjectSchema).array(), z.lazy(() => WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema), z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WorkflowConditionUpdateManyWithWhereWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUpdateManyWithWhereWithoutWorkflowInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema), z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema: z.ZodType<Prisma.WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInput>;
export const WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInputObjectZodSchema = makeSchema();
