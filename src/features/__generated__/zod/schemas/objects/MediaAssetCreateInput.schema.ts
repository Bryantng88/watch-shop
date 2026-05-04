import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  key: z.string(),
  parentPrefix: z.string(),
  fileName: z.string(),
  ext: z.string().optional().nullable(),
  sizeBytes: z.number().int().optional().nullable(),
  etag: z.string().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  profile: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const MediaAssetCreateInputObjectSchema: z.ZodType<Prisma.MediaAssetCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetCreateInput>;
export const MediaAssetCreateInputObjectZodSchema = makeSchema();
