import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationCreateManyMediaObjectInputObjectSchema as MediaOperationCreateManyMediaObjectInputObjectSchema } from './MediaOperationCreateManyMediaObjectInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MediaOperationCreateManyMediaObjectInputObjectSchema), z.lazy(() => MediaOperationCreateManyMediaObjectInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MediaOperationCreateManyMediaObjectInputEnvelopeObjectSchema: z.ZodType<Prisma.MediaOperationCreateManyMediaObjectInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationCreateManyMediaObjectInputEnvelope>;
export const MediaOperationCreateManyMediaObjectInputEnvelopeObjectZodSchema = makeSchema();
