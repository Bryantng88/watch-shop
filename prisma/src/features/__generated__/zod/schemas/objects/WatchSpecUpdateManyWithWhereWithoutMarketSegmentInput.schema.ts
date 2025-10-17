import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecScalarWhereInputObjectSchema as WatchSpecScalarWhereInputObjectSchema } from './WatchSpecScalarWhereInput.schema';
import { WatchSpecUpdateManyMutationInputObjectSchema as WatchSpecUpdateManyMutationInputObjectSchema } from './WatchSpecUpdateManyMutationInput.schema';
import { WatchSpecUncheckedUpdateManyWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedUpdateManyWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedUpdateManyWithoutMarketSegmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchSpecUpdateManyMutationInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateManyWithoutMarketSegmentInputObjectSchema)])
}).strict();
export const WatchSpecUpdateManyWithWhereWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateManyWithWhereWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateManyWithWhereWithoutMarketSegmentInput>;
export const WatchSpecUpdateManyWithWhereWithoutMarketSegmentInputObjectZodSchema = makeSchema();
