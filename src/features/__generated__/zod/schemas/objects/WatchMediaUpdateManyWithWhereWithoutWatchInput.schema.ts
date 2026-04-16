import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaScalarWhereInputObjectSchema as WatchMediaScalarWhereInputObjectSchema } from './WatchMediaScalarWhereInput.schema';
import { WatchMediaUpdateManyMutationInputObjectSchema as WatchMediaUpdateManyMutationInputObjectSchema } from './WatchMediaUpdateManyMutationInput.schema';
import { WatchMediaUncheckedUpdateManyWithoutWatchInputObjectSchema as WatchMediaUncheckedUpdateManyWithoutWatchInputObjectSchema } from './WatchMediaUncheckedUpdateManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchMediaScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchMediaUpdateManyMutationInputObjectSchema), z.lazy(() => WatchMediaUncheckedUpdateManyWithoutWatchInputObjectSchema)])
}).strict();
export const WatchMediaUpdateManyWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchMediaUpdateManyWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaUpdateManyWithWhereWithoutWatchInput>;
export const WatchMediaUpdateManyWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
