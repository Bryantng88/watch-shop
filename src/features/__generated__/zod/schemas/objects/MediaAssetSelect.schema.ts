import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  key: z.boolean().optional(),
  parentPrefix: z.boolean().optional(),
  fileName: z.boolean().optional(),
  ext: z.boolean().optional(),
  sizeBytes: z.boolean().optional(),
  etag: z.boolean().optional(),
  lastModified: z.boolean().optional(),
  profile: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const MediaAssetSelectObjectSchema: z.ZodType<Prisma.MediaAssetSelect> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetSelect>;
export const MediaAssetSelectObjectZodSchema = makeSchema();
