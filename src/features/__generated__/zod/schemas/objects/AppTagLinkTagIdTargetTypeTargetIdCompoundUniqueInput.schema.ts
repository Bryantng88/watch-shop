import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema'

const makeSchema = () => z.object({
  tagId: z.string(),
  targetType: AppTagTargetTypeSchema,
  targetId: z.string()
}).strict();
export const AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInput>;
export const AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInputObjectZodSchema = makeSchema();
