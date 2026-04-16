import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema'

const nestedenumstrapfilterSchema = z.object({
  equals: StrapSchema.optional(),
  in: StrapSchema.array().optional(),
  notIn: StrapSchema.array().optional(),
  not: z.union([StrapSchema, z.lazy(() => NestedEnumStrapFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapFilter> = nestedenumstrapfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapFilter>;
export const NestedEnumStrapFilterObjectZodSchema = nestedenumstrapfilterSchema;
