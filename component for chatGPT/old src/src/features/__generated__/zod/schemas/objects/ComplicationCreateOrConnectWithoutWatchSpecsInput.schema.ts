import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationCreateWithoutWatchSpecsInputObjectSchema as ComplicationCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationCreateWithoutWatchSpecsInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecsInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema)])
}).strict();
export const ComplicationCreateOrConnectWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationCreateOrConnectWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCreateOrConnectWithoutWatchSpecsInput>;
export const ComplicationCreateOrConnectWithoutWatchSpecsInputObjectZodSchema = makeSchema();
