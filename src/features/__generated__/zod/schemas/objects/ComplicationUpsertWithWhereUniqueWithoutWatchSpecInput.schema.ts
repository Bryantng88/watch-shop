import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationUpdateWithoutWatchSpecInputObjectSchema as ComplicationUpdateWithoutWatchSpecInputObjectSchema } from './ComplicationUpdateWithoutWatchSpecInput.schema';
import { ComplicationUncheckedUpdateWithoutWatchSpecInputObjectSchema as ComplicationUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedUpdateWithoutWatchSpecInput.schema';
import { ComplicationCreateWithoutWatchSpecInputObjectSchema as ComplicationCreateWithoutWatchSpecInputObjectSchema } from './ComplicationCreateWithoutWatchSpecInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ComplicationUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUncheckedUpdateWithoutWatchSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const ComplicationUpsertWithWhereUniqueWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationUpsertWithWhereUniqueWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpsertWithWhereUniqueWithoutWatchSpecInput>;
export const ComplicationUpsertWithWhereUniqueWithoutWatchSpecInputObjectZodSchema = makeSchema();
