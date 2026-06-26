import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: AppTagTargetTypeSchema,
  targetId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const AppTagLinkCreateWithoutTagInputObjectSchema: z.ZodType<Prisma.AppTagLinkCreateWithoutTagInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCreateWithoutTagInput>;
export const AppTagLinkCreateWithoutTagInputObjectZodSchema = makeSchema();
