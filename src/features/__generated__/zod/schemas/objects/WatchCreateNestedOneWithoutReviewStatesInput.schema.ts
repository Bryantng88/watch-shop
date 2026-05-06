import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutReviewStatesInputObjectSchema as WatchCreateWithoutReviewStatesInputObjectSchema } from './WatchCreateWithoutReviewStatesInput.schema';
import { WatchUncheckedCreateWithoutReviewStatesInputObjectSchema as WatchUncheckedCreateWithoutReviewStatesInputObjectSchema } from './WatchUncheckedCreateWithoutReviewStatesInput.schema';
import { WatchCreateOrConnectWithoutReviewStatesInputObjectSchema as WatchCreateOrConnectWithoutReviewStatesInputObjectSchema } from './WatchCreateOrConnectWithoutReviewStatesInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutReviewStatesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutReviewStatesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutReviewStatesInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutReviewStatesInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutReviewStatesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutReviewStatesInput>;
export const WatchCreateNestedOneWithoutReviewStatesInputObjectZodSchema = makeSchema();
