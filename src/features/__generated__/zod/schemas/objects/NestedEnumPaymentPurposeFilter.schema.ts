import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema'

const nestedenumpaymentpurposefilterSchema = z.object({
  equals: PaymentPurposeSchema.optional(),
  in: PaymentPurposeSchema.array().optional(),
  notIn: PaymentPurposeSchema.array().optional(),
  not: z.union([PaymentPurposeSchema, z.lazy(() => NestedEnumPaymentPurposeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPaymentPurposeFilterObjectSchema: z.ZodType<Prisma.NestedEnumPaymentPurposeFilter> = nestedenumpaymentpurposefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPaymentPurposeFilter>;
export const NestedEnumPaymentPurposeFilterObjectZodSchema = nestedenumpaymentpurposefilterSchema;
