import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingFindManySchema as MediaBindingFindManySchema } from '../findManyMediaBinding.schema';
import { MediaOperationFindManySchema as MediaOperationFindManySchema } from '../findManyMediaOperation.schema';
import { MediaObjectCountOutputTypeArgsObjectSchema as MediaObjectCountOutputTypeArgsObjectSchema } from './MediaObjectCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  bucket: z.boolean().optional(),
  storageKey: z.boolean().optional(),
  originalFileName: z.boolean().optional(),
  mimeType: z.boolean().optional(),
  sizeBytes: z.boolean().optional(),
  checksum: z.boolean().optional(),
  etag: z.boolean().optional(),
  availability: z.boolean().optional(),
  verifiedAt: z.boolean().optional(),
  missingAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  bindings: z.union([z.boolean(), z.lazy(() => MediaBindingFindManySchema)]).optional(),
  operations: z.union([z.boolean(), z.lazy(() => MediaOperationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MediaObjectCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MediaObjectSelectObjectSchema: z.ZodType<Prisma.MediaObjectSelect> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectSelect>;
export const MediaObjectSelectObjectZodSchema = makeSchema();
