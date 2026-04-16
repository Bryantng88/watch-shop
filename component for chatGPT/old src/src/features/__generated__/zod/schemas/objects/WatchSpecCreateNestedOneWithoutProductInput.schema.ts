import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateWithoutProductInputObjectSchema as WatchSpecCreateWithoutProductInputObjectSchema } from './WatchSpecCreateWithoutProductInput.schema';
import { WatchSpecUncheckedCreateWithoutProductInputObjectSchema as WatchSpecUncheckedCreateWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateWithoutProductInput.schema';
import { WatchSpecCreateOrConnectWithoutProductInputObjectSchema as WatchSpecCreateOrConnectWithoutProductInputObjectSchema } from './WatchSpecCreateOrConnectWithoutProductInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecCreateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchSpecCreateOrConnectWithoutProductInputObjectSchema).optional(),
  connect: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchSpecCreateNestedOneWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateNestedOneWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateNestedOneWithoutProductInput>;
export const WatchSpecCreateNestedOneWithoutProductInputObjectZodSchema = makeSchema();
