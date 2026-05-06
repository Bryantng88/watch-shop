import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutReviewStatesInputObjectSchema as WatchCreateWithoutReviewStatesInputObjectSchema } from './WatchCreateWithoutReviewStatesInput.schema';
import { WatchUncheckedCreateWithoutReviewStatesInputObjectSchema as WatchUncheckedCreateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedCreateWithoutReviewStatesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutReviewStatesInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutReviewStatesInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutReviewStatesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutReviewStatesInput>;
export const WatchCreateOrConnectWithoutReviewStatesInputObjectZodSchema = makeSchema();
