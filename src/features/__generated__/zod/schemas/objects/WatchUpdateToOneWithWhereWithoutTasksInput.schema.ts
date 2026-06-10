import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutTasksInputObjectSchema as WatchUpdateWithoutTasksInputObjectSchema } from './WatchUpdateWithoutTasksInput.schema';
import { WatchUncheckedUpdateWithoutTasksInputObjectSchema as WatchUncheckedUpdateWithoutTasksInputObjectSchema } from './WatchUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutTasksInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutTasksInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutTasksInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutTasksInput>;
export const WatchUpdateToOneWithWhereWithoutTasksInputObjectZodSchema = makeSchema();
