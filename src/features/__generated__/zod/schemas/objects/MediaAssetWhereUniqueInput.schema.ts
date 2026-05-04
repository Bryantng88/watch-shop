import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  key: z.string().optional()
}).strict();
export const MediaAssetWhereUniqueInputObjectSchema: z.ZodType<Prisma.MediaAssetWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetWhereUniqueInput>;
export const MediaAssetWhereUniqueInputObjectZodSchema = makeSchema();
