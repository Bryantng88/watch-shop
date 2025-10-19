import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentUpdateWithoutWatchSpecsInputObjectSchema as MarketSegmentUpdateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUpdateWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedUpdateWithoutWatchSpecsInput.schema';
import { MarketSegmentCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecsInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MarketSegmentUpdateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUncheckedUpdateWithoutWatchSpecsInputObjectSchema)]),
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInput>;
export const MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecsInputObjectZodSchema = makeSchema();
