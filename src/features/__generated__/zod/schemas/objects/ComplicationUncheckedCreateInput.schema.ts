import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecUncheckedCreateNestedManyWithoutComplicationInputObjectSchema as WatchSpecUncheckedCreateNestedManyWithoutComplicationInputObjectSchema } from './WatchSpecUncheckedCreateNestedManyWithoutComplicationInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  watchSpecs: z.lazy(() => WatchSpecUncheckedCreateNestedManyWithoutComplicationInputObjectSchema)
}).strict();
export const ComplicationUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedCreateInput>;
export const ComplicationUncheckedCreateInputObjectZodSchema = makeSchema();
