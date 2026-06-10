import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutWorkCasesInputObjectSchema as WatchUpdateWithoutWorkCasesInputObjectSchema } from './WatchUpdateWithoutWorkCasesInput.schema';
import { WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema as WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedUpdateWithoutWorkCasesInput.schema';
import { WatchCreateWithoutWorkCasesInputObjectSchema as WatchCreateWithoutWorkCasesInputObjectSchema } from './WatchCreateWithoutWorkCasesInput.schema';
import { WatchUncheckedCreateWithoutWorkCasesInputObjectSchema as WatchUncheckedCreateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedCreateWithoutWorkCasesInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWorkCasesInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutWorkCasesInput>;
export const WatchUpsertWithoutWorkCasesInputObjectZodSchema = makeSchema();
