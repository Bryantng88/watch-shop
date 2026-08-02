import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryPolicySchema } from '../enums/StrapInventoryPolicy.schema';
import { NestedEnumStrapInventoryPolicyFilterObjectSchema as NestedEnumStrapInventoryPolicyFilterObjectSchema } from './NestedEnumStrapInventoryPolicyFilter.schema'

const makeSchema = () => z.object({
  equals: StrapInventoryPolicySchema.optional(),
  in: StrapInventoryPolicySchema.array().optional(),
  notIn: StrapInventoryPolicySchema.array().optional(),
  not: z.union([StrapInventoryPolicySchema, z.lazy(() => NestedEnumStrapInventoryPolicyFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapInventoryPolicyFilterObjectSchema: z.ZodType<Prisma.EnumStrapInventoryPolicyFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapInventoryPolicyFilter>;
export const EnumStrapInventoryPolicyFilterObjectZodSchema = makeSchema();
