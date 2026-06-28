import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateUpdateWithoutConditionsInputObjectSchema as WorkflowTemplateUpdateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutConditionsInput.schema';
import { WorkflowTemplateCreateWithoutConditionsInputObjectSchema as WorkflowTemplateCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutConditionsInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema)]),
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUpsertWithoutConditionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpsertWithoutConditionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpsertWithoutConditionsInput>;
export const WorkflowTemplateUpsertWithoutConditionsInputObjectZodSchema = makeSchema();
