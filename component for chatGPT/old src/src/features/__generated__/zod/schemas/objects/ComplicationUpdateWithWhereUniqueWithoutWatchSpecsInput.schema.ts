import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationUpdateWithoutWatchSpecsInputObjectSchema as ComplicationUpdateWithoutWatchSpecsInputObjectSchema } from './ComplicationUpdateWithoutWatchSpecsInput.schema';
import { ComplicationUncheckedUpdateWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedUpdateWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedUpdateWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ComplicationUpdateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUncheckedUpdateWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInput>;
export const ComplicationUpdateWithWhereUniqueWithoutWatchSpecsInputObjectZodSchema = makeSchema();
