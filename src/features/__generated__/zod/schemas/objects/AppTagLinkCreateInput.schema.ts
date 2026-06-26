import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { AppTagCreateNestedOneWithoutLinksInputObjectSchema as AppTagCreateNestedOneWithoutLinksInputObjectSchema } from './AppTagCreateNestedOneWithoutLinksInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: AppTagTargetTypeSchema,
  targetId: z.string(),
  createdAt: z.coerce.date().optional(),
  tag: z.lazy(() => AppTagCreateNestedOneWithoutLinksInputObjectSchema)
}).strict();
export const AppTagLinkCreateInputObjectSchema: z.ZodType<Prisma.AppTagLinkCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCreateInput>;
export const AppTagLinkCreateInputObjectZodSchema = makeSchema();
