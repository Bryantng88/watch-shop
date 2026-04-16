import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const ComplicationUncheckedCreateWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedCreateWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedCreateWithoutWatchSpecsInput>;
export const ComplicationUncheckedCreateWithoutWatchSpecsInputObjectZodSchema = makeSchema();
