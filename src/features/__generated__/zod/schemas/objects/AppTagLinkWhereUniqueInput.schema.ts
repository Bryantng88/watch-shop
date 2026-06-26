import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInputObjectSchema as AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInputObjectSchema } from './AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  tagId_targetType_targetId: z.lazy(() => AppTagLinkTagIdTargetTypeTargetIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const AppTagLinkWhereUniqueInputObjectSchema: z.ZodType<Prisma.AppTagLinkWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkWhereUniqueInput>;
export const AppTagLinkWhereUniqueInputObjectZodSchema = makeSchema();
