import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateWithoutComplicationInputObjectSchema as WatchSpecUpdateWithoutComplicationInputObjectSchema } from './WatchSpecUpdateWithoutComplicationInput.schema';
import { WatchSpecUncheckedUpdateWithoutComplicationInputObjectSchema as WatchSpecUncheckedUpdateWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutComplicationInput.schema';
import { WatchSpecCreateWithoutComplicationInputObjectSchema as WatchSpecCreateWithoutComplicationInputObjectSchema } from './WatchSpecCreateWithoutComplicationInput.schema';
import { WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema as WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedCreateWithoutComplicationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchSpecUpdateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutComplicationInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchSpecCreateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema)])
}).strict();
export const WatchSpecUpsertWithWhereUniqueWithoutComplicationInputObjectSchema: z.ZodType<Prisma.WatchSpecUpsertWithWhereUniqueWithoutComplicationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpsertWithWhereUniqueWithoutComplicationInput>;
export const WatchSpecUpsertWithWhereUniqueWithoutComplicationInputObjectZodSchema = makeSchema();
