import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutReviewStatesInputObjectSchema as WatchUpdateWithoutReviewStatesInputObjectSchema } from './WatchUpdateWithoutReviewStatesInput.schema';
import { WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema as WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedUpdateWithoutReviewStatesInput.schema';
import { WatchCreateWithoutReviewStatesInputObjectSchema as WatchCreateWithoutReviewStatesInputObjectSchema } from './WatchCreateWithoutReviewStatesInput.schema';
import { WatchUncheckedCreateWithoutReviewStatesInputObjectSchema as WatchUncheckedCreateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedCreateWithoutReviewStatesInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutReviewStatesInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutReviewStatesInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutReviewStatesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutReviewStatesInput>;
export const WatchUpsertWithoutReviewStatesInputObjectZodSchema = makeSchema();
