import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentPurposeSchema } from '../enums/PaymentPurpose.schema';
import { NestedEnumPaymentPurposeFilterObjectSchema as NestedEnumPaymentPurposeFilterObjectSchema } from './NestedEnumPaymentPurposeFilter.schema'

const makeSchema = () => z.object({
  equals: PaymentPurposeSchema.optional(),
  in: PaymentPurposeSchema.array().optional(),
  notIn: PaymentPurposeSchema.array().optional(),
  not: z.union([PaymentPurposeSchema, z.lazy(() => NestedEnumPaymentPurposeFilterObjectSchema)]).optional()
}).strict();
export const EnumPaymentPurposeFilterObjectSchema: z.ZodType<Prisma.EnumPaymentPurposeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentPurposeFilter>;
export const EnumPaymentPurposeFilterObjectZodSchema = makeSchema();
