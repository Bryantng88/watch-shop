import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ComplicationCreateWithoutWatchSpecInputObjectSchema as ComplicationCreateWithoutWatchSpecInputObjectSchema } from './ComplicationCreateWithoutWatchSpecInput.schema';
import { ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema as ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ComplicationUncheckedCreateWithoutWatchSpecInput.schema';
import { ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema as ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema } from './ComplicationCreateOrConnectWithoutWatchSpecInput.schema';
import { ComplicationWhereUniqueInputObjectSchema as ComplicationWhereUniqueInputObjectSchema } from './ComplicationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ComplicationCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationCreateWithoutWatchSpecInputObjectSchema).array(), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema), z.lazy(() => ComplicationCreateOrConnectWithoutWatchSpecInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ComplicationWhereUniqueInputObjectSchema), z.lazy(() => ComplicationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ComplicationUncheckedCreateNestedManyWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedCreateNestedManyWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedCreateNestedManyWithoutWatchSpecInput>;
export const ComplicationUncheckedCreateNestedManyWithoutWatchSpecInputObjectZodSchema = makeSchema();
