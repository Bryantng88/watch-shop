import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateWithoutProductInputObjectSchema as WatchSpecCreateWithoutProductInputObjectSchema } from './WatchSpecCreateWithoutProductInput.schema';
import { WatchSpecUncheckedCreateWithoutProductInputObjectSchema as WatchSpecUncheckedCreateWithoutProductInputObjectSchema } from './WatchSpecUncheckedCreateWithoutProductInput.schema';
import { WatchSpecCreateOrConnectWithoutProductInputObjectSchema as WatchSpecCreateOrConnectWithoutProductInputObjectSchema } from './WatchSpecCreateOrConnectWithoutProductInput.schema';
import { WatchSpecUpsertWithoutProductInputObjectSchema as WatchSpecUpsertWithoutProductInputObjectSchema } from './WatchSpecUpsertWithoutProductInput.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './WatchSpecWhereInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateToOneWithWhereWithoutProductInputObjectSchema as WatchSpecUpdateToOneWithWhereWithoutProductInputObjectSchema } from './WatchSpecUpdateToOneWithWhereWithoutProductInput.schema';
import { WatchSpecUpdateWithoutProductInputObjectSchema as WatchSpecUpdateWithoutProductInputObjectSchema } from './WatchSpecUpdateWithoutProductInput.schema';
import { WatchSpecUncheckedUpdateWithoutProductInputObjectSchema as WatchSpecUncheckedUpdateWithoutProductInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecCreateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchSpecCreateOrConnectWithoutProductInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchSpecUpsertWithoutProductInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchSpecWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchSpecWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchSpecUpdateToOneWithWhereWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUpdateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutProductInputObjectSchema)]).optional()
}).strict();
export const WatchSpecUncheckedUpdateOneWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.WatchSpecUncheckedUpdateOneWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUncheckedUpdateOneWithoutProductNestedInput>;
export const WatchSpecUncheckedUpdateOneWithoutProductNestedInputObjectZodSchema = makeSchema();
