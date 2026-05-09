import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  key: z.literal(true).optional(),
  parentPrefix: z.literal(true).optional(),
  fileName: z.literal(true).optional(),
  ext: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional(),
  etag: z.literal(true).optional(),
  lastModified: z.literal(true).optional(),
  profile: z.literal(true).optional(),
  status: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  role: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  isMissing: z.literal(true).optional(),
  missingAt: z.literal(true).optional(),
  lastSeenAt: z.literal(true).optional(),
  movedFromKey: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const MediaAssetMaxAggregateInputObjectSchema: z.ZodType<Prisma.MediaAssetMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetMaxAggregateInputType>;
export const MediaAssetMaxAggregateInputObjectZodSchema = makeSchema();
