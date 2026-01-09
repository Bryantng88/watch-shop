import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderVerificationStatusSchema } from '../enums/OrderVerificationStatus.schema';
import { NestedEnumOrderVerificationStatusFilterObjectSchema as NestedEnumOrderVerificationStatusFilterObjectSchema } from './NestedEnumOrderVerificationStatusFilter.schema'

const makeSchema = () => z.object({
  equals: OrderVerificationStatusSchema.optional(),
  in: OrderVerificationStatusSchema.array().optional(),
  notIn: OrderVerificationStatusSchema.array().optional(),
  not: z.union([OrderVerificationStatusSchema, z.lazy(() => NestedEnumOrderVerificationStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumOrderVerificationStatusFilterObjectSchema: z.ZodType<Prisma.EnumOrderVerificationStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderVerificationStatusFilter>;
export const EnumOrderVerificationStatusFilterObjectZodSchema = makeSchema();
