import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema';
import { WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema as WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema)])
}).strict();
export const WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInput>;
export const WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInputObjectZodSchema = makeSchema();
