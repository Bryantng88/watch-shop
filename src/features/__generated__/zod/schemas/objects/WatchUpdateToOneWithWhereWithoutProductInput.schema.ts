import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutProductInputObjectSchema as WatchUpdateWithoutProductInputObjectSchema } from './WatchUpdateWithoutProductInput.schema';
import { WatchUncheckedUpdateWithoutProductInputObjectSchema as WatchUncheckedUpdateWithoutProductInputObjectSchema } from './WatchUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutProductInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutProductInput>;
export const WatchUpdateToOneWithWhereWithoutProductInputObjectZodSchema = makeSchema();
