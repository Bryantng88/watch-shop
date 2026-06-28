import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutActionsInputObjectSchema as WorkflowTemplateCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutActionsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutActionsInput.schema';
import { WorkflowTemplateUpsertWithoutActionsInputObjectSchema as WorkflowTemplateUpsertWithoutActionsInputObjectSchema } from './WorkflowTemplateUpsertWithoutActionsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateUpdateToOneWithWhereWithoutActionsInputObjectSchema as WorkflowTemplateUpdateToOneWithWhereWithoutActionsInputObjectSchema } from './WorkflowTemplateUpdateToOneWithWhereWithoutActionsInput.schema';
import { WorkflowTemplateUpdateWithoutActionsInputObjectSchema as WorkflowTemplateUpdateWithoutActionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutActionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutActionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutActionsInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkflowTemplateUpsertWithoutActionsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkflowTemplateUpdateToOneWithWhereWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUpdateWithoutActionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutActionsInputObjectSchema)]).optional()
}).strict();
export const WorkflowTemplateUpdateOneRequiredWithoutActionsNestedInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateOneRequiredWithoutActionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateOneRequiredWithoutActionsNestedInput>;
export const WorkflowTemplateUpdateOneRequiredWithoutActionsNestedInputObjectZodSchema = makeSchema();
