import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateNestedManyWithoutMarketSegmentInputObjectSchema as WatchSpecCreateNestedManyWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateNestedManyWithoutMarketSegmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  watchSpecs: z.lazy(() => WatchSpecCreateNestedManyWithoutMarketSegmentInputObjectSchema)
}).strict();
export const MarketSegmentCreateInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateInput>;
export const MarketSegmentCreateInputObjectZodSchema = makeSchema();
