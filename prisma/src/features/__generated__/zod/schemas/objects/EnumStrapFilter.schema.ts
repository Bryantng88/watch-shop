import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { NestedEnumStrapFilterObjectSchema as NestedEnumStrapFilterObjectSchema } from './NestedEnumStrapFilter.schema'

const makeSchema = () => z.object({
  equals: StrapSchema.optional(),
  in: StrapSchema.array().optional(),
  notIn: StrapSchema.array().optional(),
  not: z.union([StrapSchema, z.lazy(() => NestedEnumStrapFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapFilterObjectSchema: z.ZodType<Prisma.EnumStrapFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapFilter>;
export const EnumStrapFilterObjectZodSchema = makeSchema();
