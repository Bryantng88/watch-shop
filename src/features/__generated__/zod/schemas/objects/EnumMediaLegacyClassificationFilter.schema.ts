import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { NestedEnumMediaLegacyClassificationFilterObjectSchema as NestedEnumMediaLegacyClassificationFilterObjectSchema } from './NestedEnumMediaLegacyClassificationFilter.schema'

const makeSchema = () => z.object({
  equals: MediaLegacyClassificationSchema.optional(),
  in: MediaLegacyClassificationSchema.array().optional(),
  notIn: MediaLegacyClassificationSchema.array().optional(),
  not: z.union([MediaLegacyClassificationSchema, z.lazy(() => NestedEnumMediaLegacyClassificationFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaLegacyClassificationFilterObjectSchema: z.ZodType<Prisma.EnumMediaLegacyClassificationFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaLegacyClassificationFilter>;
export const EnumMediaLegacyClassificationFilterObjectZodSchema = makeSchema();
