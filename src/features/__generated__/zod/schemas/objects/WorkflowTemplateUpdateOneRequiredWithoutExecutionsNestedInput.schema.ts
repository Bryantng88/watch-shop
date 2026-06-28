import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutExecutionsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutExecutionsInput.schema';
import { WorkflowTemplateUpsertWithoutExecutionsInputObjectSchema as WorkflowTemplateUpsertWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUpsertWithoutExecutionsInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInputObjectSchema as WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInput.schema';
import { WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema as WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUpdateWithoutExecutionsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkflowTemplateUpsertWithoutExecutionsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkflowTemplateUpdateToOneWithWhereWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutExecutionsInputObjectSchema)]).optional()
}).strict();
export const WorkflowTemplateUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateOneRequiredWithoutExecutionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateOneRequiredWithoutExecutionsNestedInput>;
export const WorkflowTemplateUpdateOneRequiredWithoutExecutionsNestedInputObjectZodSchema = makeSchema();
