import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutConditionsInputObjectSchema as WorkflowTemplateCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutConditionsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutConditionsInput.schema';
import { WorkflowTemplateUpsertWithoutConditionsInputObjectSchema as WorkflowTemplateUpsertWithoutConditionsInputObjectSchema } from './WorkflowTemplateUpsertWithoutConditionsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInputObjectSchema as WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInputObjectSchema } from './WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInput.schema';
import { WorkflowTemplateUpdateWithoutConditionsInputObjectSchema as WorkflowTemplateUpdateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutConditionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutConditionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutConditionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutConditionsInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkflowTemplateUpsertWithoutConditionsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkflowTemplateUpdateToOneWithWhereWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUpdateWithoutConditionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutConditionsInputObjectSchema)]).optional()
}).strict();
export const WorkflowTemplateUpdateOneRequiredWithoutConditionsNestedInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateOneRequiredWithoutConditionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateOneRequiredWithoutConditionsNestedInput>;
export const WorkflowTemplateUpdateOneRequiredWithoutConditionsNestedInputObjectZodSchema = makeSchema();
