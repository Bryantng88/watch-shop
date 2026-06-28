import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateCreateWithoutTagsInputObjectSchema as WorkflowTemplateCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedCreateWithoutTagsInput.schema';
import { WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema as WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateOrConnectWithoutTagsInput.schema';
import { WorkflowTemplateUpsertWithoutTagsInputObjectSchema as WorkflowTemplateUpsertWithoutTagsInputObjectSchema } from './WorkflowTemplateUpsertWithoutTagsInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './WorkflowTemplateWhereUniqueInput.schema';
import { WorkflowTemplateUpdateToOneWithWhereWithoutTagsInputObjectSchema as WorkflowTemplateUpdateToOneWithWhereWithoutTagsInputObjectSchema } from './WorkflowTemplateUpdateToOneWithWhereWithoutTagsInput.schema';
import { WorkflowTemplateUpdateWithoutTagsInputObjectSchema as WorkflowTemplateUpdateWithoutTagsInputObjectSchema } from './WorkflowTemplateUpdateWithoutTagsInput.schema';
import { WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema as WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema } from './WorkflowTemplateUncheckedUpdateWithoutTagsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowTemplateCreateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowTemplateCreateOrConnectWithoutTagsInputObjectSchema).optional(),
  upsert: z.lazy(() => WorkflowTemplateUpsertWithoutTagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WorkflowTemplateWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WorkflowTemplateWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WorkflowTemplateWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WorkflowTemplateUpdateToOneWithWhereWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUpdateWithoutTagsInputObjectSchema), z.lazy(() => WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema)]).optional()
}).strict();
export const WorkflowTemplateUpdateOneWithoutTagsNestedInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateOneWithoutTagsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateOneWithoutTagsNestedInput>;
export const WorkflowTemplateUpdateOneWithoutTagsNestedInputObjectZodSchema = makeSchema();
