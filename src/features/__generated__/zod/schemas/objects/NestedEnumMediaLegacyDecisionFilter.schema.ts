import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema'

const nestedenummedialegacydecisionfilterSchema = z.object({
  equals: MediaLegacyDecisionSchema.optional(),
  in: MediaLegacyDecisionSchema.array().optional(),
  notIn: MediaLegacyDecisionSchema.array().optional(),
  not: z.union([MediaLegacyDecisionSchema, z.lazy(() => NestedEnumMediaLegacyDecisionFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaLegacyDecisionFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaLegacyDecisionFilter> = nestedenummedialegacydecisionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaLegacyDecisionFilter>;
export const NestedEnumMediaLegacyDecisionFilterObjectZodSchema = nestedenummedialegacydecisionfilterSchema;
