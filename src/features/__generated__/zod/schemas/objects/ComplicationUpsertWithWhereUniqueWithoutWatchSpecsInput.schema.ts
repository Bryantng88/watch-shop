import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationUpdateWithoutWatchSpecsInputObjectSchema as ComplicationUpdateWithoutWatchSpecsInputObjectSchema } from './ComplicationUpdateWithoutWatchSpecsInput.schema';
import { ComplicationUncheckedUpdateWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedUpdateWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedUpdateWithoutWatchSpecsInput.schema';
import { ComplicationCreateWithoutWatchSpecsInputObjectSchema as ComplicationCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateWithoutWatchSpecsInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ComplicationUpdateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUncheckedUpdateWithoutWatchSpecsInputObjectSchema)]),
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInput>;
export const ComplicationUpsertWithWhereUniqueWithoutWatchSpecsInputObjectZodSchema = makeSchema();
