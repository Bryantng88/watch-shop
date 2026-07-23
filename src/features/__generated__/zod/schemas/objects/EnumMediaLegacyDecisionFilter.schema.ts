import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema';
import { NestedEnumMediaLegacyDecisionFilterObjectSchema as NestedEnumMediaLegacyDecisionFilterObjectSchema } from './NestedEnumMediaLegacyDecisionFilter.schema'

const makeSchema = () => z.object({
  equals: MediaLegacyDecisionSchema.optional(),
  in: MediaLegacyDecisionSchema.array().optional(),
  notIn: MediaLegacyDecisionSchema.array().optional(),
  not: z.union([MediaLegacyDecisionSchema, z.lazy(() => NestedEnumMediaLegacyDecisionFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaLegacyDecisionFilterObjectSchema: z.ZodType<Prisma.EnumMediaLegacyDecisionFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaLegacyDecisionFilter>;
export const EnumMediaLegacyDecisionFilterObjectZodSchema = makeSchema();
