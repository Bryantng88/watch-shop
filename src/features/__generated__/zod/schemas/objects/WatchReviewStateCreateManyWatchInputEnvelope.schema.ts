import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateCreateManyWatchInputObjectSchema as WatchReviewStateCreateManyWatchInputObjectSchema } from './WatchReviewStateCreateManyWatchInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WatchReviewStateCreateManyWatchInputObjectSchema), z.lazy(() => WatchReviewStateCreateManyWatchInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateManyWatchInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateManyWatchInputEnvelope>;
export const WatchReviewStateCreateManyWatchInputEnvelopeObjectZodSchema = makeSchema();
