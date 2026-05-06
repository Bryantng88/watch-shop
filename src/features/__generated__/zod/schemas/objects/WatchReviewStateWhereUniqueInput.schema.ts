import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWatchIdTargetTypeCompoundUniqueInputObjectSchema as WatchReviewStateWatchIdTargetTypeCompoundUniqueInputObjectSchema } from './WatchReviewStateWatchIdTargetTypeCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  watchId_targetType: z.lazy(() => WatchReviewStateWatchIdTargetTypeCompoundUniqueInputObjectSchema).optional()
}).strict();
export const WatchReviewStateWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchReviewStateWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateWhereUniqueInput>;
export const WatchReviewStateWhereUniqueInputObjectZodSchema = makeSchema();
