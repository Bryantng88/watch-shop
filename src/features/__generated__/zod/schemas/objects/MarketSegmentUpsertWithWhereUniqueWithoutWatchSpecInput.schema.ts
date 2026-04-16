import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentWhereUniqueInputObjectSchema as MarketSegmentWhereUniqueInputObjectSchema } from './MarketSegmentWhereUniqueInput.schema';
import { MarketSegmentUpdateWithoutWatchSpecInputObjectSchema as MarketSegmentUpdateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUpdateWithoutWatchSpecInput.schema';
import { MarketSegmentUncheckedUpdateWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedUpdateWithoutWatchSpecInput.schema';
import { MarketSegmentCreateWithoutWatchSpecInputObjectSchema as MarketSegmentCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentCreateWithoutWatchSpecInput.schema';
import { MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedCreateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MarketSegmentUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUncheckedUpdateWithoutWatchSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => MarketSegmentCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInput>;
export const MarketSegmentUpsertWithWhereUniqueWithoutWatchSpecInputObjectZodSchema = makeSchema();
