import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionUpdateWithoutWorkflowInputObjectSchema as WorkflowActionUpdateWithoutWorkflowInputObjectSchema } from './WorkflowActionUpdateWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedUpdateWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedUpdateWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedUpdateWithoutWorkflowInput.schema';
import { WorkflowActionCreateWithoutWorkflowInputObjectSchema as WorkflowActionCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedCreateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkflowActionUpdateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUncheckedUpdateWithoutWorkflowInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowActionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInput>;
export const WorkflowActionUpsertWithWhereUniqueWithoutWorkflowInputObjectZodSchema = makeSchema();
