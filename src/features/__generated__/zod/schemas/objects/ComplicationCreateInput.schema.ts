import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateNestedManyWithoutComplicationInputObjectSchema as WatchSpecCreateNestedManyWithoutComplicationInputObjectSchema } from './WatchSpecCreateNestedManyWithoutComplicationInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  WatchSpec: z.lazy(() => WatchSpecCreateNestedManyWithoutComplicationInputObjectSchema)
}).strict();
export const ComplicationCreateInputObjectSchema: z.ZodType<Prisma.ComplicationCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCreateInput>;
export const ComplicationCreateInputObjectZodSchema = makeSchema();
