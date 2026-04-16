import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentScalarWhereInputObjectSchema as MarketSegmentScalarWhereInputObjectSchema } from './MarketSegmentScalarWhereInput.schema';
import { MarketSegmentUpdateManyMutationInputObjectSchema as MarketSegmentUpdateManyMutationInputObjectSchema } from './MarketSegmentUpdateManyMutationInput.schema';
import { MarketSegmentUncheckedUpdateManyWithoutWatchSpecInputObjectSchema as MarketSegmentUncheckedUpdateManyWithoutWatchSpecInputObjectSchema } from './MarketSegmentUncheckedUpdateManyWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MarketSegmentUpdateManyMutationInputObjectSchema), z.lazy(() => MarketSegmentUncheckedUpdateManyWithoutWatchSpecInputObjectSchema)])
}).strict();
export const MarketSegmentUpdateManyWithWhereWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateManyWithWhereWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateManyWithWhereWithoutWatchSpecInput>;
export const MarketSegmentUpdateManyWithWhereWithoutWatchSpecInputObjectZodSchema = makeSchema();
