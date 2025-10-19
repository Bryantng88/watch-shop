import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecScalarWhereInputObjectSchema as WatchSpecScalarWhereInputObjectSchema } from './WatchSpecScalarWhereInput.schema';
import { WatchSpecUpdateManyMutationInputObjectSchema as WatchSpecUpdateManyMutationInputObjectSchema } from './WatchSpecUpdateManyMutationInput.schema';
import { WatchSpecUncheckedUpdateManyWithoutComplicationInputObjectSchema as WatchSpecUncheckedUpdateManyWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedUpdateManyWithoutComplicationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchSpecUpdateManyMutationInputObjectSchema), z.lazy(() => WatchSpecUncheckedUpdateManyWithoutComplicationInputObjectSchema)])
}).strict();
export const WatchSpecUpdateManyWithWhereWithoutComplicationInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateManyWithWhereWithoutComplicationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateManyWithWhereWithoutComplicationInput>;
export const WatchSpecUpdateManyWithWhereWithoutComplicationInputObjectZodSchema = makeSchema();
