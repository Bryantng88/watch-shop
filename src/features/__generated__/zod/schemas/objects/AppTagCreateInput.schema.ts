import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { AppTagLinkCreateNestedManyWithoutTagInputObjectSchema as AppTagLinkCreateNestedManyWithoutTagInputObjectSchema } from './AppTagLinkCreateNestedManyWithoutTagInput.schema';
import { WorkflowTemplateCreateNestedOneWithoutTagsInputObjectSchema as WorkflowTemplateCreateNestedOneWithoutTagsInputObjectSchema } from './WorkflowTemplateCreateNestedOneWithoutTagsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  color: z.string().optional().nullable(),
  scope: AppTagScopeSchema.optional(),
  ownerType: AppTagOwnerTypeSchema.optional().nullable(),
  ownerId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  links: z.lazy(() => AppTagLinkCreateNestedManyWithoutTagInputObjectSchema),
  workflowTemplate: z.lazy(() => WorkflowTemplateCreateNestedOneWithoutTagsInputObjectSchema).optional()
}).strict();
export const AppTagCreateInputObjectSchema: z.ZodType<Prisma.AppTagCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateInput>;
export const AppTagCreateInputObjectZodSchema = makeSchema();
