import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const ComplicationUncheckedCreateWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationUncheckedCreateWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUncheckedCreateWithoutWatchSpecInput>;
export const ComplicationUncheckedCreateWithoutWatchSpecInputObjectZodSchema = makeSchema();
