import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchMediaInputObjectSchema as WatchCreateWithoutWatchMediaInputObjectSchema } from './WatchCreateWithoutWatchMediaInput.schema';
import { WatchUncheckedCreateWithoutWatchMediaInputObjectSchema as WatchUncheckedCreateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedCreateWithoutWatchMediaInput.schema';
import { WatchCreateOrConnectWithoutWatchMediaInputObjectSchema as WatchCreateOrConnectWithoutWatchMediaInputObjectSchema } from './WatchCreateOrConnectWithoutWatchMediaInput.schema';
import { WatchUpsertWithoutWatchMediaInputObjectSchema as WatchUpsertWithoutWatchMediaInputObjectSchema } from './WatchUpsertWithoutWatchMediaInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutWatchMediaInputObjectSchema as WatchUpdateToOneWithWhereWithoutWatchMediaInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutWatchMediaInput.schema';
import { WatchUpdateWithoutWatchMediaInputObjectSchema as WatchUpdateWithoutWatchMediaInputObjectSchema } from './WatchUpdateWithoutWatchMediaInput.schema';
import { WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema as WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchMediaInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchMediaInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchMediaInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutWatchMediaInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUpdateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutWatchMediaNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchMediaNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchMediaNestedInput>;
export const WatchUpdateOneRequiredWithoutWatchMediaNestedInputObjectZodSchema = makeSchema();
