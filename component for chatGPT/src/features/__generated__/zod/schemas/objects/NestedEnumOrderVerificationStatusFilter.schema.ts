import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderVerificationStatusSchema } from '../enums/OrderVerificationStatus.schema'

const nestedenumorderverificationstatusfilterSchema = z.object({
  equals: OrderVerificationStatusSchema.optional(),
  in: OrderVerificationStatusSchema.array().optional(),
  notIn: OrderVerificationStatusSchema.array().optional(),
  not: z.union([OrderVerificationStatusSchema, z.lazy(() => NestedEnumOrderVerificationStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumOrderVerificationStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderVerificationStatusFilter> = nestedenumorderverificationstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderVerificationStatusFilter>;
export const NestedEnumOrderVerificationStatusFilterObjectZodSchema = nestedenumorderverificationstatusfilterSchema;
