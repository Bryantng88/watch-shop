import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { AppTagLinkCreateNestedManyWithoutTagInputObjectSchema as AppTagLinkCreateNestedManyWithoutTagInputObjectSchema } from './AppTagLinkCreateNestedManyWithoutTagInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  color: z.string().optional().nullable(),
  scope: AppTagScopeSchema.optional(),
  ownerType: AppTagOwnerTypeSchema.optional().nullable(),
  ownerId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.lazy(() => AppTagLinkCreateNestedManyWithoutTagInputObjectSchema).optional()
}).strict();
export const AppTagCreateWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagCreateWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCreateWithoutWorkflowTemplateInput>;
export const AppTagCreateWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
