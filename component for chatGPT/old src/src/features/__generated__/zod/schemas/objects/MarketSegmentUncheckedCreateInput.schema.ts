import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  watchSpecs: z.lazy(() => WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInputObjectSchema)
}).strict();
export const MarketSegmentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedCreateInput>;
export const MarketSegmentUncheckedCreateInputObjectZodSchema = makeSchema();
