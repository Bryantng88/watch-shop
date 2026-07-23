import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingCreateManyMediaObjectInputObjectSchema as MediaBindingCreateManyMediaObjectInputObjectSchema } from './MediaBindingCreateManyMediaObjectInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => MediaBindingCreateManyMediaObjectInputObjectSchema), z.lazy(() => MediaBindingCreateManyMediaObjectInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MediaBindingCreateManyMediaObjectInputEnvelopeObjectSchema: z.ZodType<Prisma.MediaBindingCreateManyMediaObjectInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingCreateManyMediaObjectInputEnvelope>;
export const MediaBindingCreateManyMediaObjectInputEnvelopeObjectZodSchema = makeSchema();
