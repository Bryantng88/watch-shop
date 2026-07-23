import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInputObjectSchema as MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInputObjectSchema } from './MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInput.schema'

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
  operations: z.lazy(() => MediaOperationUncheckedCreateNestedManyWithoutMediaObjectInputObjectSchema).optional()
}).strict();
export const MediaObjectUncheckedCreateWithoutBindingsInputObjectSchema: z.ZodType<Prisma.MediaObjectUncheckedCreateWithoutBindingsInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectUncheckedCreateWithoutBindingsInput>;
export const MediaObjectUncheckedCreateWithoutBindingsInputObjectZodSchema = makeSchema();
