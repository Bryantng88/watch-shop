import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema';
import { WorkflowTemplateUpdateWithoutConditionsInputObjectSchema as WorkflowTemplateUpdateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutConditionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema)])
}).strict();
export const WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInput>;
export const WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInputObjectZodSchema = makeSchema();
