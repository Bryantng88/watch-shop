import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema';
import { ComplicationCreateWithoutWatchSpecInputObjectSchema as ComplicationCreateWithoutWatchSpecInputObjectSchema } from './ComplicationCreateWithoutWatchSpecInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ComplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationCreateOrConnectWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCreateOrConnectWithoutWatchSpecInput>;
export const ComplicationCreateOrConnectWithoutWatchSpecInputObjectZodSchema = makeSchema();
