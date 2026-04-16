import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutProductInputObjectSchema as WatchCreateWithoutProductInputObjectSchema } from './WatchCreateWithoutProductInput.schema';
import { WatchUncheckedCreateWithoutProductInputObjectSchema as WatchUncheckedCreateWithoutProductInputObjectSchema } from './WatchUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutProductInput>;
export const WatchCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
