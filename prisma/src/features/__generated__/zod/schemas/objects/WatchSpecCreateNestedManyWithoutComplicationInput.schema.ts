import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateWithoutComplicationInputObjectSchema as WatchSpecCreateWithoutComplicationInputObjectSchema } from './WatchSpecCreateWithoutComplicationInput.schema';
import { WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema as WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedCreateWithoutComplicationInput.schema';
import { WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema as WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema } from './WatchSpecCreateOrConnectWithoutComplicationInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecCreateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecCreateWithoutComplicationInputObjectSchema).array(), z.lazy(() => WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutComplicationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema), z.lazy(() => WatchSpecCreateOrConnectWithoutComplicationInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchSpecCreateNestedManyWithoutComplicationInputObjectSchema: z.ZodType<Prisma.WatchSpecCreateNestedManyWithoutComplicationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCreateNestedManyWithoutComplicationInput>;
export const WatchSpecCreateNestedManyWithoutComplicationInputObjectZodSchema = makeSchema();
