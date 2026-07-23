import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { MediaOperationCreateNestedManyWithoutMediaObjectInputObjectSchema as MediaOperationCreateNestedManyWithoutMediaObjectInputObjectSchema } from './MediaOperationCreateNestedManyWithoutMediaObjectInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bucket: z.string(),
  storageKey: z.string(),
  originalFileName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  sizeBytes: z.bigint().optional().nullable(),
  checksum: z.string().optional().nullable(),
  etag: z.string().optional().nullable(),
  availability: MediaObjectAvailabilitySchema.optional(),
  verifiedAt: z.coerce.date().optional().nullable(),
  missingAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  operations: z.lazy(() => MediaOperationCreateNestedManyWithoutMediaObjectInputObjectSchema).optional()
}).strict();
export const MediaObjectCreateWithoutBindingsInputObjectSchema: z.ZodType<Prisma.MediaObjectCreateWithoutBindingsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCreateWithoutBindingsInput>;
export const MediaObjectCreateWithoutBindingsInputObjectZodSchema = makeSchema();
