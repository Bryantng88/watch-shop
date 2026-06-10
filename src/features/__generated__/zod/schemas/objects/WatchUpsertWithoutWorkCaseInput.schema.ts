import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutWorkCaseInputObjectSchema as WatchUpdateWithoutWorkCaseInputObjectSchema } from './WatchUpdateWithoutWorkCaseInput.schema';
import { WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema as WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedUpdateWithoutWorkCaseInput.schema';
import { WatchCreateWithoutWorkCaseInputObjectSchema as WatchCreateWithoutWorkCaseInputObjectSchema } from './WatchCreateWithoutWorkCaseInput.schema';
import { WatchUncheckedCreateWithoutWorkCaseInputObjectSchema as WatchUncheckedCreateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCaseInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCaseInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutWorkCaseInput>;
export const WatchUpsertWithoutWorkCaseInputObjectZodSchema = makeSchema();
