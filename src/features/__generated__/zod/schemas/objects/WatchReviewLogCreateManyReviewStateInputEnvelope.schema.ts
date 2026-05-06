import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogCreateManyReviewStateInputObjectSchema as WatchReviewLogCreateManyReviewStateInputObjectSchema } from './WatchReviewLogCreateManyReviewStateInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WatchReviewLogCreateManyReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogCreateManyReviewStateInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema: z.ZodType<Prisma.WatchReviewLogCreateManyReviewStateInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogCreateManyReviewStateInputEnvelope>;
export const WatchReviewLogCreateManyReviewStateInputEnvelopeObjectZodSchema = makeSchema();
