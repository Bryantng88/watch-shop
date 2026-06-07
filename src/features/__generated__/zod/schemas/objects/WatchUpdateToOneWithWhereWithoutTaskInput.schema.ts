import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutTaskInputObjectSchema as WatchUpdateWithoutTaskInputObjectSchema } from './WatchUpdateWithoutTaskInput.schema';
import { WatchUncheckedUpdateWithoutTaskInputObjectSchema as WatchUncheckedUpdateWithoutTaskInputObjectSchema } from './WatchUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutTaskInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutTaskInput>;
export const WatchUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
