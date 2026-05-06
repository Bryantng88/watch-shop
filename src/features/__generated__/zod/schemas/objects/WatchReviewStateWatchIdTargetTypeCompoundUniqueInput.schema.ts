import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema'

const makeSchema = () => z.object({
  watchId: z.string(),
  targetType: WatchReviewTargetTypeSchema
}).strict();
export const WatchReviewStateWatchIdTargetTypeCompoundUniqueInputObjectSchema: z.ZodType<Prisma.WatchReviewStateWatchIdTargetTypeCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateWatchIdTargetTypeCompoundUniqueInput>;
export const WatchReviewStateWatchIdTargetTypeCompoundUniqueInputObjectZodSchema = makeSchema();
