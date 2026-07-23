import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { MediaBindingCreateNestedManyWithoutMediaObjectInputObjectSchema as MediaBindingCreateNestedManyWithoutMediaObjectInputObjectSchema } from './MediaBindingCreateNestedManyWithoutMediaObjectInput.schema'

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
  bindings: z.lazy(() => MediaBindingCreateNestedManyWithoutMediaObjectInputObjectSchema).optional()
}).strict();
export const MediaObjectCreateWithoutOperationsInputObjectSchema: z.ZodType<Prisma.MediaObjectCreateWithoutOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCreateWithoutOperationsInput>;
export const MediaObjectCreateWithoutOperationsInputObjectZodSchema = makeSchema();
