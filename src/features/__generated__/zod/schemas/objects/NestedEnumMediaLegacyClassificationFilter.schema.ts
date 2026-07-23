import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema'

const nestedenummedialegacyclassificationfilterSchema = z.object({
  equals: MediaLegacyClassificationSchema.optional(),
  in: MediaLegacyClassificationSchema.array().optional(),
  notIn: MediaLegacyClassificationSchema.array().optional(),
  not: z.union([MediaLegacyClassificationSchema, z.lazy(() => NestedEnumMediaLegacyClassificationFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaLegacyClassificationFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaLegacyClassificationFilter> = nestedenummedialegacyclassificationfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaLegacyClassificationFilter>;
export const NestedEnumMediaLegacyClassificationFilterObjectZodSchema = nestedenummedialegacyclassificationfilterSchema;
