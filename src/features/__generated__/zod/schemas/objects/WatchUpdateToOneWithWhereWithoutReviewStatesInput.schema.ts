import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutReviewStatesInputObjectSchema as WatchUpdateWithoutReviewStatesInputObjectSchema } from './WatchUpdateWithoutReviewStatesInput.schema';
import { WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema as WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedUpdateWithoutReviewStatesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutReviewStatesInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutReviewStatesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutReviewStatesInput>;
export const WatchUpdateToOneWithWhereWithoutReviewStatesInputObjectZodSchema = makeSchema();
