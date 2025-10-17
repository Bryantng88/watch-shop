import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentScalarWhereInputObjectSchema as MarketSegmentScalarWhereInputObjectSchema } from './MarketSegmentScalarWhereInput.schema';
import { MarketSegmentUpdateManyMutationInputObjectSchema as MarketSegmentUpdateManyMutationInputObjectSchema } from './MarketSegmentUpdateManyMutationInput.schema';
import { MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema as MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema } from './MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MarketSegmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MarketSegmentUpdateManyMutationInputObjectSchema), z.lazy(() => MarketSegmentUncheckedUpdateManyWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInput>;
export const MarketSegmentUpdateManyWithWhereWithoutWatchSpecsInputObjectZodSchema = makeSchema();
