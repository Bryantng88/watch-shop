import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateOrConnectWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUpsertWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUpsertWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUpsertWithoutWatchReviewLogInput.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUpdateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchReviewStateUpsertWithoutWatchReviewLogInputObjectSchema).optional(),
  connect: z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema)]).optional()
}).strict();
export const WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInput>;
export const WatchReviewStateUpdateOneRequiredWithoutWatchReviewLogNestedInputObjectZodSchema = makeSchema();
