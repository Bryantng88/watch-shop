import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationUpdateWithoutWatchSpecInputObjectSchema as ComplicationUpdateWithoutWatchSpecInputObjectSchema } from './ComplicationUpdateWithoutWatchSpecInput.schema';
import { ComplicationUncheckedUpdateWithoutWatchSpecInputObjectSchema as ComplicationUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedUpdateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ComplicationUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUncheckedUpdateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const ComplicationUpdateWithWhereUniqueWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateWithWhereUniqueWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateWithWhereUniqueWithoutWatchSpecInput>;
export const ComplicationUpdateWithWhereUniqueWithoutWatchSpecInputObjectZodSchema = makeSchema();
