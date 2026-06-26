import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  tagId: z.string(),
  targetType: AppTagTargetTypeSchema,
  targetId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const AppTagLinkCreateManyInputObjectSchema: z.ZodType<Prisma.AppTagLinkCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCreateManyInput>;
export const AppTagLinkCreateManyInputObjectZodSchema = makeSchema();
