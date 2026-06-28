import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema as WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutExecutionsInput.schema';
import { WorkflowTemplateCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema)]),
  where: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUpsertWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpsertWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpsertWithoutExecutionsInput>;
export const WorkflowTemplateUpsertWithoutExecutionsInputObjectZodSchema = makeSchema();
