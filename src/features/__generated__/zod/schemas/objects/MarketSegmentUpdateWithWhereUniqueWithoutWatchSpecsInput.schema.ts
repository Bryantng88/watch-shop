import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentUpdateWithoutWatchSpecsInputObjectSchema as MarketSegmentUpdateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUpdateWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedUpdateWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MarketSegmentUpdateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInput>;
export const MarketSegmentUpdateWithWhereUniqueWithoutWatchSpecsInputObjectZodSchema = makeSchema();
