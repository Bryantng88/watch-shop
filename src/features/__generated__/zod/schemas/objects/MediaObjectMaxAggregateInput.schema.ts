import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  bucket: z.literal(true).optional(),
  storageKey: z.literal(true).optional(),
  originalFileName: z.literal(true).optional(),
  mimeType: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional(),
  checksum: z.literal(true).optional(),
  etag: z.literal(true).optional(),
  availability: z.literal(true).optional(),
  verifiedAt: z.literal(true).optional(),
  missingAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const MediaObjectMaxAggregateInputObjectSchema: z.ZodType<Prisma.MediaObjectMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectMaxAggregateInputType>;
export const MediaObjectMaxAggregateInputObjectZodSchema = makeSchema();
