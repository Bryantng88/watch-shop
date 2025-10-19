import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecCreateWithoutComplicationInputObjectSchema as WatchSpecCreateWithoutComplicationInputObjectSchema } from './WatchSpecCreateWithoutComplicationInput.schema';
import { WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema as WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedCreateWithoutComplicationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchSpecCreateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema)])
}).strict();
export const WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateOrConnectWithoutComplicationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateOrConnectWithoutComplicationInput>;
export const WatchSpecCreateOrConnectWithoutComplicationInputObjectZodSchema = makeSchema();
