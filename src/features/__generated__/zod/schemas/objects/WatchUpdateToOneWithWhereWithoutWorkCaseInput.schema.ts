import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutWorkCaseInputObjectSchema as WatchUpdateWithoutWorkCaseInputObjectSchema } from './WatchUpdateWithoutWorkCaseInput.schema';
import { WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema as WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './WatchUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWorkCaseInput>;
export const WatchUpdateToOneWithWhereWithoutWorkCaseInputObjectZodSchema = makeSchema();
