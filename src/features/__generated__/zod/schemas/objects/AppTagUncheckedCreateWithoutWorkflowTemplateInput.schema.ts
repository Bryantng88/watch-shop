import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { AppTagLinkUncheckedCreateNestedManyWithoutTagInputObjectSchema as AppTagLinkUncheckedCreateNestedManyWithoutTagInputObjectSchema } from './AppTagLinkUncheckedCreateNestedManyWithoutTagInput.schema'

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
  links: z.lazy(() => AppTagLinkUncheckedCreateNestedManyWithoutTagInputObjectSchema).optional()
}).strict();
export const AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectSchema: z.ZodType<Prisma.AppTagUncheckedCreateWithoutWorkflowTemplateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagUncheckedCreateWithoutWorkflowTemplateInput>;
export const AppTagUncheckedCreateWithoutWorkflowTemplateInputObjectZodSchema = makeSchema();
