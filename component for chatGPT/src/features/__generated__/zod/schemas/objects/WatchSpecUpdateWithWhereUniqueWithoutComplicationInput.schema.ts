import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateWithoutComplicationInputObjectSchema as WatchSpecUpdateWithoutComplicationInputObjectSchema } from './WatchSpecUpdateWithoutComplicationInput.schema';
import { WatchSpecUncheckedUpdateWithoutComplicationInputObjectSchema as WatchSpecUncheckedUpdateWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutComplicationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchSpecUpdateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutComplicationInputObjectSchema)])
}).strict();
export const WatchSpecUpdateWithWhereUniqueWithoutComplicationInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateWithWhereUniqueWithoutComplicationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateWithWhereUniqueWithoutComplicationInput>;
export const WatchSpecUpdateWithWhereUniqueWithoutComplicationInputObjectZodSchema = makeSchema();
