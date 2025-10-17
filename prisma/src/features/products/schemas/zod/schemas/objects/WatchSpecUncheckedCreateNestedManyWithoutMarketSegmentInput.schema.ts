import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateWithoutMarketSegmentInputObjectSchema as WatchSpecCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateWithoutMarketSegmentInput.schema';
import { WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedCreateWithoutMarketSegmentInput.schema';
import { WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema as WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateOrConnectWithoutMarketSegmentInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecCreateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecCreateWithoutMarketSegmentInputObjectSchema).array(), z.lazy(() => WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInputObjectSchema: z.ZodType<Prisma.WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInput>;
export const WatchSpecUncheckedCreateNestedManyWithoutMarketSegmentInputObjectZodSchema = makeSchema();
