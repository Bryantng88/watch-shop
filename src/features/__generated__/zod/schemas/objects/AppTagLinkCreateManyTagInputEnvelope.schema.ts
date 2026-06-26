import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkCreateManyTagInputObjectSchema as AppTagLinkCreateManyTagInputObjectSchema } from './AppTagLinkCreateManyTagInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => AppTagLinkCreateManyTagInputObjectSchema), z.lazy(() => AppTagLinkCreateManyTagInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AppTagLinkCreateManyTagInputEnvelopeObjectSchema: z.ZodType<Prisma.AppTagLinkCreateManyTagInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkCreateManyTagInputEnvelope>;
export const AppTagLinkCreateManyTagInputEnvelopeObjectZodSchema = makeSchema();
