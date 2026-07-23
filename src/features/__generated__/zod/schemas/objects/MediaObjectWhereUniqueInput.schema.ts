import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  storageKey: z.string().optional()
}).strict();
export const MediaObjectWhereUniqueInputObjectSchema: z.ZodType<Prisma.MediaObjectWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectWhereUniqueInput>;
export const MediaObjectWhereUniqueInputObjectZodSchema = makeSchema();
