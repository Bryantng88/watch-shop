import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaCreateManyWatchInputObjectSchema as WatchMediaCreateManyWatchInputObjectSchema } from './WatchMediaCreateManyWatchInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WatchMediaCreateManyWatchInputObjectSchema), z.lazy(() => WatchMediaCreateManyWatchInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WatchMediaCreateManyWatchInputEnvelopeObjectSchema: z.ZodType<Prisma.WatchMediaCreateManyWatchInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaCreateManyWatchInputEnvelope>;
export const WatchMediaCreateManyWatchInputEnvelopeObjectZodSchema = makeSchema();
