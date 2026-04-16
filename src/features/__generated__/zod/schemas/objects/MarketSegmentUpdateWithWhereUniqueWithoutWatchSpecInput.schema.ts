import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentUpdateWithoutWatchSpecInputObjectSchema as MarketSegmentUpdateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUpdateWithoutWatchSpecInput.schema';
import { MarketSegmentUncheckedUpdateWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedUpdateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MarketSegmentUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUncheckedUpdateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInput>;
export const MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecInputObjectZodSchema = makeSchema();
