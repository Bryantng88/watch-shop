import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutWorkCasesInputObjectSchema as WatchUpdateWithoutWorkCasesInputObjectSchema } from './WatchUpdateWithoutWorkCasesInput.schema';
import { WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema as WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema } from './WatchUncheckedUpdateWithoutWorkCasesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutWorkCasesInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWorkCasesInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutWorkCasesInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWorkCasesInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWorkCasesInput>;
export const WatchUpdateToOneWithWhereWithoutWorkCasesInputObjectZodSchema = makeSchema();
