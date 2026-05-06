import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutReviewStatesInputObjectSchema as WatchCreateWithoutReviewStatesInputObjectSchema } from './WatchCreateWithoutReviewStatesInput.schema';
import { WatchUncheckedCreateWithoutReviewStatesInputObjectSchema as WatchUncheckedCreateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedCreateWithoutReviewStatesInput.schema';
import { WatchCreateOrConnectWithoutReviewStatesInputObjectSchema as WatchCreateOrConnectWithoutReviewStatesInputObjectSchema } from './WatchCreateOrConnectWithoutReviewStatesInput.schema';
import { WatchUpsertWithoutReviewStatesInputObjectSchema as WatchUpsertWithoutReviewStatesInputObjectSchema } from './WatchUpsertWithoutReviewStatesInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutReviewStatesInputObjectSchema as WatchUpdateToOneWithWhereWithoutReviewStatesInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutReviewStatesInput.schema';
import { WatchUpdateWithoutReviewStatesInputObjectSchema as WatchUpdateWithoutReviewStatesInputObjectSchema } from './WatchUpdateWithoutReviewStatesInput.schema';
import { WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema as WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedUpdateWithoutReviewStatesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutReviewStatesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutReviewStatesInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutReviewStatesInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUpdateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutReviewStatesInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutReviewStatesNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutReviewStatesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutReviewStatesNestedInput>;
export const WatchUpdateOneRequiredWithoutReviewStatesNestedInputObjectZodSchema = makeSchema();
