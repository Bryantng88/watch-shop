import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './WatchSpecWhereInput.schema';
import { WatchSpecUpdateWithoutProductInputObjectSchema as WatchSpecUpdateWithoutProductInputObjectSchema } from './WatchSpecUpdateWithoutProductInput.schema';
import { WatchSpecUncheckedUpdateWithoutProductInputObjectSchema as WatchSpecUncheckedUpdateWithoutProductInputObjectSchema } from './WatchSpecUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchSpecUpdateWithoutProductInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const WatchSpecUpdateToOneWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateToOneWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateToOneWithWhereWithoutProductInput>;
export const WatchSpecUpdateToOneWithWhereWithoutProductInputObjectZodSchema = makeSchema();
