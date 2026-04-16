import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaCreateWithoutWatchInputObjectSchema as WatchMediaCreateWithoutWatchInputObjectSchema } from './WatchMediaCreateWithoutWatchInput.schema';
import { WatchMediaUncheckedCreateWithoutWatchInputObjectSchema as WatchMediaUncheckedCreateWithoutWatchInputObjectSchema } from './WatchMediaUncheckedCreateWithoutWatchInput.schema';
import { WatchMediaCreateOrConnectWithoutWatchInputObjectSchema as WatchMediaCreateOrConnectWithoutWatchInputObjectSchema } from './WatchMediaCreateOrConnectWithoutWatchInput.schema';
import { WatchMediaCreateManyWatchInputEnvelopeObjectSchema as WatchMediaCreateManyWatchInputEnvelopeObjectSchema } from './WatchMediaCreateManyWatchInputEnvelope.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './WatchMediaWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchMediaCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WatchMediaUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchMediaCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchMediaCreateManyWatchInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WatchMediaWhereUniqueInputObjectSchema), z.lazy(() => WatchMediaWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchMediaUncheckedCreateNestedManyWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchMediaUncheckedCreateNestedManyWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaUncheckedCreateNestedManyWithoutWatchInput>;
export const WatchMediaUncheckedCreateNestedManyWithoutWatchInputObjectZodSchema = makeSchema();
