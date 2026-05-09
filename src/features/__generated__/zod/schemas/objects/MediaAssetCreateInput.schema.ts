import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema';
import { ImageRoleSchema } from '../enums/ImageRole.schema'

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
  status: MediaAssetStatusSchema.optional(),
  productId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  role: ImageRoleSchema.optional().nullable(),
  sortOrder: z.number().int().optional(),
  isMissing: z.boolean().optional(),
  missingAt: z.coerce.date().optional().nullable(),
  lastSeenAt: z.coerce.date().optional().nullable(),
  movedFromKey: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const MediaAssetCreateInputObjectSchema: z.ZodType<Prisma.MediaAssetCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetCreateInput>;
export const MediaAssetCreateInputObjectZodSchema = makeSchema();
