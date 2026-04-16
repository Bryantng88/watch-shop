import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutProductInputObjectSchema as WatchCreateWithoutProductInputObjectSchema } from './WatchCreateWithoutProductInput.schema';
import { WatchUncheckedCreateWithoutProductInputObjectSchema as WatchUncheckedCreateWithoutProductInputObjectSchema } from './WatchUncheckedCreateWithoutProductInput.schema';
import { WatchCreateOrConnectWithoutProductInputObjectSchema as WatchCreateOrConnectWithoutProductInputObjectSchema } from './WatchCreateOrConnectWithoutProductInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutProductInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutProductInput>;
export const WatchCreateNestedOneWithoutProductInputObjectZodSchema = makeSchema();
