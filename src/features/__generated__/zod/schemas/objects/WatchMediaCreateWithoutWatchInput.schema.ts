import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyProductImageId: z.string().optional().nullable(),
  key: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  role: ImageRoleSchema.optional().nullable(),
  sortOrder: z.number().int().optional(),
  alt: z.string().optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  mime: z.string().optional().nullable(),
  sizeBytes: z.number().int().optional().nullable(),
  dominantHex: z.string().optional().nullable(),
  contentHash: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WatchMediaCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchMediaCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaCreateWithoutWatchInput>;
export const WatchMediaCreateWithoutWatchInputObjectZodSchema = makeSchema();
